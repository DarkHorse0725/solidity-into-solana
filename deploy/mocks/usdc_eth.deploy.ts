import { HardhatRuntimeEnvironment} from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { parseUnits } from 'ethers/lib/utils'

const deployUSDC: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { ethers, deployments, getNamedAccounts} = hre
    const { deploy, execute } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy('FiatTokenV2_1', {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: false,
    })

    // await execute(
    //     'FiatTokenV2_1',
    //     {from: deployer, log: true},
    //     'initialize',
    //     'USD Coin', 'USDC', 'USDC', 6, deployer, deployer, deployer, deployer
    // )

    // await execute(
    //     'FiatTokenV2_1',
    //     {from: deployer, log: true},
    //     'initializeV2',
    //     'USD Coin'
    // )

    // await execute(
    //     'FiatTokenV2_1',
    //     {from: deployer, log: true},
    //     'configureMinter',
    //     deployer, parseUnits("1000000000000000000000000000", 30)
    // ) 

    // await execute(
    //     'FiatTokenV2_1',
    //     {from: deployer, log: true},
    //     'initializeV2_1',
    //     deployer
    // )
}

deployUSDC.tags = ['USDC']
deployUSDC.skip = () => Promise.resolve(true);

export default deployUSDC
