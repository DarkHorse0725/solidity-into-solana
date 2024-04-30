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

    const vestingImplementationAddr = (await deployments.get("Vesting"))
      .address;

    await hre.run("verify:verify", {
      address: vestingImplementationAddr,
      constructorArguments: [],
      contract: "contracts/core/Vesting.sol:Vesting",
    });
  } catch (error) {
    console.log(error);
  }
};

verification.tags = ["VERIFICATION_VESTING"];
verification.dependencies = ["VESTING"];
verification.skip = () => Promise.resolve(true);

// verification.runAtTheEnd = true

export default verification;
