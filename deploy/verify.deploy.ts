import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  verifyEtherscanContractByName,
  verifyEtherscanProxyContract,
} from "../helpers/etherscan-verification";
import { setDRE } from "../helpers/misc-utils";

const contractVerification: DeployFunction = async (
  hre: HardhatRuntimeEnvironment,
) => {
  const { deployments, ethers, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  setDRE(hre);

  const IGNITION_FACTORY_PROXY = (
    await deployments.get("IgnitionFactory_Proxy")
  ).address;

  const IGNITION_FACTORY_IMPL = (
    await deployments.get("IgnitionFactory_Implementation")
  ).address;

  // await verifyEtherscanContractByName('VestingLogic');
  // await verifyEtherscanContractByName('PoolLogic');
  // await verifyEtherscanContractByName('Pool');
  // await verifyEtherscanContractByName('Vesting');
  // await verifyEtherscanProxyContract(
  //   IGNITION_FACTORY_PROXY,
  //   IGNITION_FACTORY_IMPL,
  // );
};

contractVerification.runAtTheEnd = true;

export default contractVerification;
