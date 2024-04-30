import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployPoolImplementation: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const poolLogicAddr = (await deployments.get("PoolLogic")).address;
  const vestingLogicAddr = (await deployments.get("VestingLogic")).address;

  await deploy("Pool", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
    libraries: {
      VestingLogic: vestingLogicAddr,
      PoolLogic: poolLogicAddr,
    },
  });
};

deployPoolImplementation.tags = ["POOL"];
deployPoolImplementation.dependencies = ["POOL_LOGIC", "VESTING_LOGIC"];

export default deployPoolImplementation;
