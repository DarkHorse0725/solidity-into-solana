import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployFactory: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const poolImplementationAddr = (await deployments.get("Pool")).address;
  const vestingImplementationAddr = (await deployments.get("Vesting")).address;

  await deploy("IgnitionFactory", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        methodName: "initialize",
        args: [poolImplementationAddr, vestingImplementationAddr],
      },
    },
  });
};

deployFactory.tags = ["FACTORY"];
deployFactory.dependencies = ["VESTING", "POOL"];

export default deployFactory;
