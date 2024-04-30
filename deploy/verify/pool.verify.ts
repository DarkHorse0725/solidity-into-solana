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
      }, 30);
    });

    console.log("----- START VERIFICATION -----");

    try {
      const poolLogicAddress = (await deployments.get("PoolLogic")).address;

      await hre.run("verify:verify", {
        address: poolLogicAddress,
        constructorArguments: [],
        contract: "contracts/logics/PoolLogic.sol:PoolLogic",
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const vestingLogicAddress = (await deployments.get("VestingLogic"))
        .address;

      await hre.run("verify:verify", {
        address: vestingLogicAddress,
        constructorArguments: [],
        contract: "contracts/logics/VestingLogic.sol:VestingLogic",
      });
    } catch (error) {
      console.log(error);
    }

    const poolImplementationAddr = (await deployments.get("Pool")).address;

    await hre.run("verify:verify", {
      address: poolImplementationAddr,
      constructorArguments: [],
      contract: "contracts/core/Pool.sol:Pool",
    });
  } catch (error) {
    console.log(error);
  }
};

verification.tags = ["VERIFICATION_POOL"];
verification.dependencies = ["POOL"];
verification.skip = () => Promise.resolve(true);
// verification.runAtTheEnd = true

export default verification;
