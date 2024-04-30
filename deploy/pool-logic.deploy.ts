import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployPoolLogic: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const { address: PoolLogicAddress } = await deploy("PoolLogic", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
  });
};

deployPoolLogic.tags = ["POOL_LOGIC"];

export default deployPoolLogic;
