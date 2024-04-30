import { HardhatRuntimeEnvironment} from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { parseUnits } from 'ethers/lib/utils'

const deployUSDT: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { ethers, deployments, getNamedAccounts} = hre
    const { deploy, execute } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy('TetherToken', {
        from: deployer,
        args: [parseUnits("1000000000000000000000000000", 30), 'Tether USD', 'USDT', 6],
        log: true,
        deterministicDeployment: false,
    })

    // await execute(
    //     'TetherToken',
    //     {from: deployer, log: true},
    //     'issue',
    //     parseUnits('1000000', '30')
    // )
}

deployUSDT.tags = ['USDT']
deployUSDT.skip = () => Promise.resolve(true);

export default deployUSDT
