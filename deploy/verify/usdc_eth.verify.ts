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

    const usdcAddr = (await deployments.get("FiatTokenV2_1")).address;
    // const usdcAddr = '0x6Cc3b65850f5d65158542bd8Da8031ea12B183dD'

    console.log("----- START VERIFICATION -----");

    await hre.run("verify:verify", {
      address: usdcAddr,
      constructorArguments: [],
      contract: "contracts/test/USDC_ETH.sol:FiatTokenV2_1",
    });
  } catch (error) {
    console.log(error);
  }
};

verification.tags = ["VERIFICATION_USDC"];
verification.skip = () => Promise.resolve(true);
// verification.dependencies = ['ERC20TOKEN']
// verification.runAtTheEnd = true

export default verification;
