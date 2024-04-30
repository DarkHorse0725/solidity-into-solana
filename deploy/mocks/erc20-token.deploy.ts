import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployERC20Token: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("ERC20Token", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
  });

  // await execute(
  //     'ERC20Token',
  //     {from: deployer, log: true},
  //     'initialize',
  //     'USD Coin', 'USDC', 6
  // )
};

deployERC20Token.tags = ["ERC20_TOKEN"];
deployERC20Token.skip = () => Promise.resolve(true);

export default deployERC20Token;
