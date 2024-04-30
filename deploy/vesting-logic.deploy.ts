import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployVestingLogic: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const { address: vestingLogicAddress } = await deploy("VestingLogic", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
  });
};

deployVestingLogic.tags = ["VESTING_LOGIC"];

export default deployVestingLogic;
