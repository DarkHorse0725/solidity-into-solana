import { BigNumber, ethers } from "ethers"
import { solidityKeccak256 } from "ethers/lib/utils"

type PoolInfo = {
    IDOToken: string
    purchaseToken: string
    maxPurchaseAmountForKYCUser: BigNumber
    maxPurchaseAmountForNotKYCUser: BigNumber
    TGEDate: BigNumber
    TGEPercentage: BigNumber
    galaxyParticipationFeePercentage: BigNumber
    crowdfundingParticipationFeePercentage: BigNumber
    galaxyPoolProportion: BigNumber
    earlyAccessProportion: BigNumber
    totalRaiseAmount: BigNumber
    whaleOpenTime: BigNumber
    whaleDuration: BigNumber
    communityDuration: BigNumber
    rate: BigNumber
    decimal: BigNumber
    price: number
}

async function main(){
    const poolInfo: PoolInfo = {
        IDOToken: '0xe78303A187CB395Fd4e456D52e2Ef2Cc79D56a8A',
        purchaseToken: '0x9dF4bE09D503Fae50972034935A6Df0264163b84',
        maxPurchaseAmountForKYCUser: BigNumber.from('10000000000'),
        maxPurchaseAmountForNotKYCUser: BigNumber.from('1000000000'),
        TGEDate: BigNumber.from('1674976852'),
        TGEPercentage: BigNumber.from('2000'),
        galaxyParticipationFeePercentage: BigNumber.from('0'),
        crowdfundingParticipationFeePercentage: BigNumber.from('1000'),
        galaxyPoolProportion: BigNumber.from('2000'),
        earlyAccessProportion: BigNumber.from('4000'),
        totalRaiseAmount: BigNumber.from('9000000000000'),
        whaleOpenTime: BigNumber.from('1672644052'),
        whaleDuration: BigNumber.from('86400'),
        communityDuration: BigNumber.from('172800'),
        rate: BigNumber.from('125000000000000'),
        decimal: BigNumber.from('1'),
        price: 0.08
    }
    const createdTimeInDb = BigNumber.from('30851800356183803377488990332')
    const abiCoder = new ethers.utils.AbiCoder()
    const encodeData = abiCoder.encode(['address[2]','uint[14]','uint'],[[poolInfo.IDOToken, poolInfo.purchaseToken],[poolInfo.maxPurchaseAmountForKYCUser, poolInfo.maxPurchaseAmountForNotKYCUser, poolInfo.TGEDate, poolInfo.TGEPercentage, poolInfo.galaxyParticipationFeePercentage, poolInfo.crowdfundingParticipationFeePercentage, poolInfo.galaxyPoolProportion, poolInfo.earlyAccessProportion, poolInfo.totalRaiseAmount, poolInfo.whaleOpenTime, poolInfo.whaleDuration, poolInfo.communityDuration, poolInfo.rate, poolInfo.decimal], createdTimeInDb])
    const poolInfoHash = solidityKeccak256(['bytes'], [encodeData])
    console.log(poolInfoHash)
}

main()