import { exit } from "process";
import fs from "fs";
import path from "path";
import { file } from "tmp-promise";
import { DRE } from "./misc-utils";
import axios from "axios";
import "dotenv/config"

const DELAY_WHEN_QUEUE = 30_000;

const fatalErrors = [
  `The address provided as argument contains a contract, but its bytecode`,
  `Daily limit of 100 source code submissions reached`,
  `has no bytecode. Is the contract deployed to this network`,
  `The constructor for`,
];

const proxyVerifySubmitErrors = [
  "Daily limit of 100 source code submissions reached",
  "Invalid API Key",
];

const proxyFatalErrors = [
  "does not seem to be verified. Please verify and publish",
  "This contract does not look like it contains any delegatecall opcode sequence.",
  "The provided expected results are different than the retrieved implementation address!",
  "A corresponding implementation contract was unfortunately not detected for the proxy address.",
];

const okErrors = [`Contract source code already verified`, "Already Verified"];
const proxyOkErrors = ["and is successfully updated."];

const unableVerifyError = "Fail - Unable to verify";

export const SUPPORTED_ETHERSCAN_NETWORKS = [
  "main",
  "ropsten",
  "kovan",
  "matic",
  "mumbai",
  "goerli",
  "avalanche",
  "fuji",
  "binancetest",
  "bsc",
  "arbitrumGoerli",
  "sepolia",
];

export const SUPPORT_ETHERSCAN_NETWORKS_WITH_API_KEY: {[key: string]: string } = {
  "goerli": "ETHERSCAN_API_KEY",
  "main": "ETHERSCAN_API_KEY",
  "bsc": "BSC_API_KEY",
  "binancetest": "BSC_API_KEY",
  "matic": "POLYGON_API_KEY",
  "mumbai": "POLYGON_API_KEY",
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const verifyEtherscanContractByName = async (
  name: string,
  specificContract?: string
) => {
  const currentNetwork = DRE.network.name;
  const deployment = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "deployments", currentNetwork, `${name}.json`),
      "utf-8"
    )
  );

  const { address, args, libraries } = deployment;
  await verifyEtherscanContract(
    address,
    args,
    JSON.stringify(libraries),
    specificContract
  );
};

export const verifyEtherscanProxyContract = async (
  address: string,
  implementation: string
) => {
  const currentNetwork = DRE.network.name;

  const API_KEY = SUPPORT_ETHERSCAN_NETWORKS_WITH_API_KEY[currentNetwork];

  const API_KEY_IN_THE_ENV = process.env[`${API_KEY}`];

  if (!API_KEY_IN_THE_ENV) {
    throw Error(`Missing process.env.${API_KEY}.`);
  }

  if (!SUPPORTED_ETHERSCAN_NETWORKS.includes(currentNetwork)) {
    throw Error(
      `Current network ${currentNetwork} not supported. Please change to one of the next networks: ${SUPPORTED_ETHERSCAN_NETWORKS.toString()}`
    );
  }

  try {
    console.log(
      "[ETHERSCAN][WARNING] Delaying Etherscan verification due their API can not find newly deployed contracts"
    );
    const msDelay = 3000;
    const times = 4;

    const params = {
      apiKey: process.env.ABITRUM_SCAN_API_KEY,
      expectedImplementation: implementation,
      address,
    };
    await callAPIWithRetry(params, times, msDelay);
  } catch (error) {}
};

export const verifyEtherscanContract = async (
  address: string,
  constructorArguments: (string | string[])[],
  libraries?: string,
  specificContract?: string
) => {
  const currentNetwork = DRE.network.name;

  const API_KEY = SUPPORT_ETHERSCAN_NETWORKS_WITH_API_KEY[currentNetwork];

  const API_KEY_IN_THE_ENV = process.env[`${API_KEY}`];

  if (!API_KEY_IN_THE_ENV) {
    throw Error(`Missing process.env.${API_KEY}.`);
  }
  if (!SUPPORTED_ETHERSCAN_NETWORKS.includes(currentNetwork)) {
    throw Error(
      `Current network ${currentNetwork} not supported. Please change to one of the next networks: ${SUPPORTED_ETHERSCAN_NETWORKS.toString()}`
    );
  }

  try {
    console.log(
      "[ETHERSCAN][WARNING] Delaying Etherscan verification due their API can not find newly deployed contracts"
    );
    const msDelay = 3000;
    const times = 4;
    // Write a temporal file to host complex parameters for buidler-etherscan https://github.com/nomiclabs/buidler/tree/development/packages/buidler-etherscan#complex-arguments
    const { fd, path, cleanup } = await file({
      prefix: "verify-params-",
      postfix: ".js",
    });
    fs.writeSync(
      fd,
      `module.exports = ${JSON.stringify([...constructorArguments])};`
    );

    let params = {
      address: address,
      libraries: JSON.parse(libraries || "{}"),
      constructorArgs: path,
      relatedSources: true,
    };

    if (specificContract) {
      params = Object.assign({}, { ...params, contract: specificContract });
    }
    await runTaskWithRetry("verify:verify", params, times, msDelay, cleanup);
  } catch (error) {}
};

export const callAPIWithRetry = async (
  params: any,
  times: number,
  msDelay: number
) => {
  let counter = times;

  // Send requests to etherscan server to verify proxy contract.
  const response = await axios.post(
    `https://api.etherscan.io/api?module=contract&action=verifyproxycontract&address=${params.address}&expectedimplementation=${params.expectedImplementation}&apikey=${params.apiKey}`
  );

  // get guid to serve polling purpose
  const { result: guid, status, message } = response.data;

  console.log("Receive guid: ", guid);

  if (status === "0" && message === "NOTOK") {
    console.error(`[ETHERSCAN][ERROR] message ${message}`);
    return;
  }

  await delay(msDelay);

  try {
    if (times > 1) {
      const response = await axios.post(
        `https://api.etherscan.io/api?module=contract&action=checkproxyverification&guid=${guid}&apikey=${params.apiKey}`
      );

      const { result, status } = await response.data;

      // See any error during proxy verification, throw to the catch
      if (status === "0") {
        throw new Error(result);
      }

      if (result.includes("and is successfully updated.")) {
        console.log(result);
      }
    } else {
      console.error(
        "[ETHERSCAN][ERROR] Errors after all the retries, check the logs for more information."
      );
    }
  } catch (error: any) {
    counter--;
    if (error.message === "Pending in queue") {
      await delay(DELAY_WHEN_QUEUE);
      counter++;
    }

    if (
      proxyFatalErrors.some((fatalError) => error.message.includes(fatalError))
    ) {
      console.error(
        "[ETHERSCAN][ERROR] Fatal error detected, skip retries and resume deployment.",
        error.message
      );
      return;
    }
    console.error("[ETHERSCAN][ERROR]", error.message);
    console.info(`[ETHERSCAN][[INFO] Retrying attemps: ${counter}.`);
    await callAPIWithRetry(params, counter, msDelay);
  }
};

export const runTaskWithRetry = async (
  task: string,
  params: any,
  times: number,
  msDelay: number,
  cleanup: () => void
) => {
  let counter = times;
  await delay(msDelay);

  try {
    if (times > 1) {
      console.log("[ETHERSCAN][INFO] Verification params: ", params);
      await DRE.run(task, params);
      cleanup();
    } else if (times === 1) {
      console.log(
        "[ETHERSCAN][WARNING] Trying to verify via uploading all sources."
      );
      delete params.relatedSources;
      await DRE.run(task, params);
      cleanup();
    } else {
      cleanup();
      console.error(
        "[ETHERSCAN][ERROR] Errors after all the retries, check the logs for more information."
      );
    }
  } catch (error: any) {
    counter--;

    if (okErrors.some((okReason) => error.message.includes(okReason))) {
      console.info(
        "[ETHERSCAN][INFO] Skipping due OK response: ",
        error.message
      );
      return;
    }

    if (fatalErrors.some((fatalError) => error.message.includes(fatalError))) {
      console.error(
        "[ETHERSCAN][ERROR] Fatal error detected, skip retries and resume deployment.",
        error.message
      );
      return;
    }
    console.error("[ETHERSCAN][ERROR]", error.message);
    console.info(`[ETHERSCAN][[INFO] Retrying attemps: ${counter}.`);
    if (error.message.includes(unableVerifyError)) {
      console.log(
        "[ETHERSCAN][WARNING] Trying to verify via uploading all sources."
      );
      delete params.relatedSources;
    }
    await runTaskWithRetry(task, params, counter, msDelay, cleanup);
  }
};

export const checkVerification = () => {
  const currentNetwork = DRE.network.name;
  const API_KEY = SUPPORT_ETHERSCAN_NETWORKS_WITH_API_KEY[currentNetwork];

  const API_KEY_IN_THE_ENV = process.env[`${API_KEY}`];

  // console.log(API_KEY, process.env);

  if (!API_KEY_IN_THE_ENV) {
    console.error("Missing process.env.ETHERSCAN_KEY.");
    exit(3);
  }
  if (!SUPPORTED_ETHERSCAN_NETWORKS.includes(currentNetwork)) {
    console.error(
      `Current network ${currentNetwork} not supported. Please change to one of the next networks: ${SUPPORTED_ETHERSCAN_NETWORKS.toString()}`
    );
    exit(5);
  }
};
