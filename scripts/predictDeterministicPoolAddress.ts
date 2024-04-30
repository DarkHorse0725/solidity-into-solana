import { BigNumber, ethers } from "ethers"
import { parseUnits, solidityKeccak256, arrayify } from "ethers/lib/utils"

type PoolInfo = {
    IDOToken: string
    purchaseToken: string
    maxPurchaseAmountForKYCUser: BigNumber
    maxPurchaseAmountForNotKYCUser: BigNumber
    TGEDate: BigNumber
    TGEPercentage: BigNumber
    participationFeePercentage: BigNumber
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

const zeroAddress: string = '0x'+'0'.repeat(40);

const IDOTokens = [
    '0x7e919252cd379Aef5f911Eae090fF6b4909b78C6',
    '0x4669E130DF0CB41f351CCd24383E226A5E0846b0',
    '0xe2911AE3ab2d6C0C55C0d81FD69Cb7dd99B4b3bc',
    '0x95Eb80e6aBb5D8de0a75bE2822AD1E10efFe9F51',
    '0xa0FA9cfEC8B6F8E0C3C7edBbBA3Ae5237FF6D4f3'
  ]

const purchaseTokens = [
    '0x856e4424f806D16E8CBC702B3c0F2ede5468eae5',
    '0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3',
    '0x3dE2Da43d4c1B137E385F36b400507c1A24401f8',
    '0xddEA3d67503164326F90F53CFD1705b90Ed1312D',
    '0xAbB608121Fd652F112827724B28a61e09f2dcDf4'
  ]

const poolInfoList = [
    {
        IDOToken: IDOTokens[0],
        purchaseToken: purchaseTokens[0],
        maxPurchaseAmountForKYCUser: parseUnits('10000',6),
        maxPurchaseAmountForNotKYCUser: parseUnits('1000',6),
        // TGEDate: BigNumber.from((Date.now()/1000).toFixed()).add(30*24*60*60),
        TGEDate: BigNumber.from('0x63c26fc1'),
        TGEPercentage: BigNumber.from('2000'),
        participationFeePercentage: BigNumber.from('1000'),
        galaxyPoolProportion: BigNumber.from('2000'),
        earlyAccessProportion: BigNumber.from('4000'),
        totalRaiseAmount: parseUnits('9000000',6),
        // whaleOpenTime: BigNumber.from((Date.now()/1000).toFixed()).add(3*24*60*60),
        whaleOpenTime: BigNumber.from('0x639ed741'),
        whaleDuration: BigNumber.from(24*60*60),
        communityDuration: BigNumber.from(48*60*60),
        rate: parseUnits('125',12),
        decimal: BigNumber.from(1),
        price: 0.08
    },
    {
        IDOToken: IDOTokens[1],
        purchaseToken: purchaseTokens[1],
        maxPurchaseAmountForKYCUser: parseUnits('30000',8),
        maxPurchaseAmountForNotKYCUser: parseUnits('15000',8),
        TGEDate: BigNumber.from((Date.now()/1000).toFixed()).add(27*24*60*60),
        TGEPercentage: BigNumber.from('1000'),
        participationFeePercentage: BigNumber.from('1500'),
        galaxyPoolProportion: BigNumber.from('5000'),
        earlyAccessProportion: BigNumber.from('5000'),
        totalRaiseAmount: parseUnits('100000', 8),
        whaleOpenTime: BigNumber.from((Date.now()/1000).toFixed()).add(3*24*60*60),
        whaleDuration: BigNumber.from(12*60*60),
        communityDuration: BigNumber.from(24*60*60),
        rate: BigNumber.from('35714285714285714285'),
        decimal: BigNumber.from(20),
        price: 0.028
    },
    {
        // IDOToken: IDOTokens[2].address,
        IDOToken: zeroAddress,
        purchaseToken: purchaseTokens[2],
        maxPurchaseAmountForKYCUser: parseUnits('10000',18),
        maxPurchaseAmountForNotKYCUser: parseUnits('1000',18),
        TGEDate: BigNumber.from((Date.now()/1000).toFixed()).add(10*24*60*60),
        TGEPercentage: BigNumber.from('1000'),
        participationFeePercentage: BigNumber.from('1500'),
        galaxyPoolProportion: BigNumber.from('1000'),
        earlyAccessProportion: BigNumber.from('6000'),
        totalRaiseAmount: parseUnits('800000',18),
        whaleOpenTime: BigNumber.from((Date.now()/1000).toFixed()).add(3*24*60*60),
        whaleDuration: BigNumber.from(24*60*60),
        communityDuration: BigNumber.from(24*60*60),
        rate: BigNumber.from(0),
        decimal: BigNumber.from(0),
        price: 0
        // rate: BigNumber.from(1),
        // decimal: BigNumber.from(9),
        // price: 10,
    },
    {
        IDOToken: IDOTokens[3],
        purchaseToken: purchaseTokens[3],
        maxPurchaseAmountForKYCUser: parseUnits('2000', 6),
        maxPurchaseAmountForNotKYCUser: parseUnits('1000', 6),
        TGEDate: BigNumber.from((Date.now()/1000).toFixed()).add(30*24*60*60),
        TGEPercentage: BigNumber.from('3000'),
        participationFeePercentage: BigNumber.from('1000'),
        galaxyPoolProportion: BigNumber.from('2000'),
        earlyAccessProportion: BigNumber.from('4000'),
        totalRaiseAmount: parseUnits('850000',6),
        whaleOpenTime: BigNumber.from((Date.now()/1000).toFixed()).add(3*24*60*60),
        whaleDuration: BigNumber.from(24*60*60),
        communityDuration: BigNumber.from(12*60*60),
        rate: BigNumber.from('1818181818181818100'),
        decimal: BigNumber.from(18),
        price: 55
    },
    {
        IDOToken: IDOTokens[4],
        purchaseToken: purchaseTokens[4],
        maxPurchaseAmountForKYCUser: parseUnits('2000', 6),
        maxPurchaseAmountForNotKYCUser: parseUnits('1000', 6),
        TGEDate: BigNumber.from((Date.now()/1000).toFixed()).add(30*24*60*60),
        TGEPercentage: BigNumber.from('3000'),
        participationFeePercentage: BigNumber.from('1000'),
        galaxyPoolProportion: BigNumber.from('2000'),
        earlyAccessProportion: BigNumber.from('4000'),
        totalRaiseAmount: parseUnits('850000',6),
        whaleOpenTime: BigNumber.from((Date.now()/1000).toFixed()).add(3*24*60*60),
        whaleDuration: BigNumber.from(24*60*60),
        communityDuration: BigNumber.from(12*60*60),
        rate: BigNumber.from('1818181818181818100'),
        decimal: BigNumber.from(18),
        price: 55
    },
]

const poolImplementation = '0x901ff11b2e65A8805d175533A5f062EB2f9bD43F'
const deployer = '0x9460b481366b7462af4f7991d430e5eB97FAAEB5'
const poolFactoryProxy = '0x89AC9209959865B9EfF5AeF042049D97cC1584cF'
const createdTimeInDb = 101;

function predictDeterministicPoolAddress(poolInfo: PoolInfo, createdTimeInDb: number, poolImplementation: string, deployer: string, poolFactoryProxy: string){
    const abiCoder = new ethers.utils.AbiCoder()
    const encodeData = abiCoder.encode(['address[2]','uint[13]','address','uint'],[[poolInfo.IDOToken, poolInfo.purchaseToken],[poolInfo.maxPurchaseAmountForKYCUser, poolInfo.maxPurchaseAmountForNotKYCUser, poolInfo.TGEDate, poolInfo.TGEPercentage, poolInfo.participationFeePercentage, poolInfo.galaxyPoolProportion, poolInfo.earlyAccessProportion, poolInfo.totalRaiseAmount, poolInfo.whaleOpenTime, poolInfo.whaleDuration, poolInfo.communityDuration, poolInfo.rate, poolInfo.decimal], deployer, createdTimeInDb])
    const salt = solidityKeccak256(['bytes'],[arrayify(encodeData)])
    const slicePoolImplementation = poolImplementation.slice(2)
    const sliceDeployer = poolFactoryProxy.slice(2)
    const sliceSalt = salt.slice(2)
    const str1 = '3d602d80600a3d3981f3363d3d373d3d3d363d73'
    const str2 = '5af43d82803e903d91602b57fd5bf3ff'

    const tmpSummaryStr = str1.concat(slicePoolImplementation).concat(str2).concat(sliceDeployer).concat(sliceSalt)
    const hash1 = solidityKeccak256(['bytes'],[arrayify('0x'.concat(tmpSummaryStr.slice(0, (3*16+7)*2)))])
    const sliceHash1 = hash1.slice(2)
    const summaryStr = tmpSummaryStr.concat(sliceHash1)
    const predictPoolAddress = solidityKeccak256(['bytes'], [arrayify('0x'.concat(summaryStr.slice((3*16+7)*2, (3*16+7)*2+(5*16+5)*2)))])
    console.log('0x'.concat(predictPoolAddress.slice(26)))
}

predictDeterministicPoolAddress(poolInfoList[0], createdTimeInDb, poolImplementation, deployer, poolFactoryProxy)

// [0x7e919252cd379Aef5f911Eae090fF6b4909b78C6,0x856e4424f806D16E8CBC702B3c0F2ede5468eae5]
// [0x02540be400,0x3b9aca00,0x63c26fc1,0x07d0,0x03e8,0x07d0,0x0fa0,0x082f79cd9000,0x639ed741,0x015180,0x02a300,0x71afd498d000,0x01]
// ["0x02540be400","0x3b9aca00","0x63c26fc1","0x07d0","0x03e8","0x07d0","0x0fa0","0x082f79cd9000","0x639ed741","0x015180","0x02a300","0x71afd498d000","0x01"]
// 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

// {
//     IDOToken: '0x7e919252cd379Aef5f911Eae090fF6b4909b78C6',
//     purchaseToken: '0x856e4424f806D16E8CBC702B3c0F2ede5468eae5',
//     maxPurchaseAmountForKYCUser: BigNumber { _hex: '0x02540be400', _isBigNumber: true },
//     maxPurchaseAmountForNotKYCUser: BigNumber { _hex: '0x3b9aca00', _isBigNumber: true },
//     TGEDate: BigNumber { _hex: '0x63c26fc1', _isBigNumber: true },
//     TGEPercentage: BigNumber { _hex: '0x07d0', _isBigNumber: true },
//     participationFeePercentage: BigNumber { _hex: '0x03e8', _isBigNumber: true },
//     galaxyPoolProportion: BigNumber { _hex: '0x07d0', _isBigNumber: true },
//     earlyAccessProportion: BigNumber { _hex: '0x0fa0', _isBigNumber: true },
//     totalRaiseAmount: BigNumber { _hex: '0x082f79cd9000', _isBigNumber: true },
//     whaleOpenTime: BigNumber { _hex: '0x639ed741', _isBigNumber: true },
//     whaleDuration: BigNumber { _hex: '0x015180', _isBigNumber: true },
//     communityDuration: BigNumber { _hex: '0x02a300', _isBigNumber: true },
//     rate: BigNumber { _hex: '0x71afd498d000', _isBigNumber: true },
//     decimal: BigNumber { _hex: '0x01', _isBigNumber: true },
//     price: 0.08
// }
