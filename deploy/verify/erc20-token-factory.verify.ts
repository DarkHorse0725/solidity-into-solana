require("dotenv").config();

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const verification: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  try {
    const { ethers, deployments, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();

    await new Promise((res, _) => {
      setTimeout(() => {
        res(true);
      }, 300);
    });

    const erc20TokenFactoryAddress = (
      await deployments.get("ERC20TokenFactory")
    ).address;

    const erc20TokenSample = (await deployments.get("ERC20Token")).address;

    console.log("----- START VERIFICATION -----");

    await hre.run("verify:verify", {
      address: erc20TokenFactoryAddress,
      constructorArguments: [erc20TokenSample],
      contract: "contracts/mocks/ERC20TokenFactory.sol:ERC20TokenFactory",
    });
  } catch (error) {
    console.log(error);
  }
};

verification.tags = ["VERIFICATION_ERC20_TOKEN_FACTORY"];
verification.skip = () => Promise.resolve(true);

// verification.dependencies = ['ERC20TOKEN']
// verification.runAtTheEnd = true

export default verification;
