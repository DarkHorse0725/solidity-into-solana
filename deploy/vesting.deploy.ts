import { HardhatRuntimeEnvironment} from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deployVestingImplementation: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { ethers, deployments, getNamedAccounts} = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const { address: vestingLogicAddress } = await deploy('VestingLogic', {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: false,
    });

    await deploy('Vesting', {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: false,
        libraries: {
            VestingLogic: vestingLogicAddress,
        }
    })
}

deployVestingImplementation.tags = ['VESTING']

export default deployVestingImplementation
