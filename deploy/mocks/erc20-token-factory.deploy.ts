import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployERC20TokenFactory: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const erc20TokenSample = (await deployments.get("ERC20Token")).address;

  await deploy("ERC20TokenFactory", {
    from: deployer,
    args: [erc20TokenSample],
    log: true,
    deterministicDeployment: false,
  });
};

deployERC20TokenFactory.tags = ["ERC20_TOKEN_FACTORY"];
deployERC20TokenFactory.skip = () => Promise.resolve(true);

export default deployERC20TokenFactory;
