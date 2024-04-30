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
      }, 3000);
    });

    console.log("----- START VERIFICATION -----");

    const poolFactoryAddr = (await deployments.get("IgnitionFactory")).address;

    await hre.run("verify:verify", {
      address: poolFactoryAddr,
      constructorArguments: [],
      contract: "contracts/core/IgnitionFactory.sol:IgnitionFactory",
    });
  } catch (error) {
    console.log(error);
  }
};

verification.tags = ["VERIFICATION_FACTORY"];
verification.dependencies = ["FACTORY"];
verification.skip = () => Promise.resolve(true);

// verification.runAtTheEnd = true

export default verification;
