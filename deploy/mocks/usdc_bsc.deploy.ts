import { HardhatRuntimeEnvironment} from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { parseUnits } from 'ethers/lib/utils'

const deployUSDC: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { ethers, deployments, getNamedAccounts} = hre
    const { deploy, execute } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy('BEP20TokenImplementation', {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: false,
    })

    // await execute(
    //     'BEP20TokenImplementation',
    //     {from: deployer, log: true},
    //     'initialize',
    //     'Binance USDC', 'USDCBSC', 18, parseUnits('100000000000000000000000', 30), true, deployer
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

deployUSDC.tags = ['USDC_BSC']
deployUSDC.skip = () => Promise.resolve(true);

export default deployUSDC
