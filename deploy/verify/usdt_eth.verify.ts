require("dotenv").config();

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { parseUnits } from "ethers/lib/utils";

const verification: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  try {
    const { ethers, deployments, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();

    await new Promise((res, _) => {
      setTimeout(() => {
        res(true);
      }, 30);
    });

    const usdcAddr = (await deployments.get("TetherToken")).address;

    console.log("----- START VERIFICATION -----");

    await hre.run("verify:verify", {
      address: usdcAddr,
      constructorArguments: [
        parseUnits("1000000000000000000000000000", 30),
        "Tether USD",
        "USDT",
        6,
      ],
      contract: "contracts/test/USDT_ETH.sol:TetherToken",
    });
  } catch (error) {
    console.log(error);
  }
};

verification.tags = ["VERIFICATION_USDT"];
verification.skip = () => Promise.resolve(true);
// verification.dependencies = ['ERC20TOKEN']
// verification.runAtTheEnd = true

export default verification;
