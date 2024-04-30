import { solidityKeccak256 } from "ethers/lib/utils"

function calculateErrorSelector(customError: string){
    console.log(solidityKeccak256(['string'],[customError]).slice(2,10), customError)
}

function main(){
    const errArray = [
        "ZeroAmount()",
        "ZeroAddress()",
        "AlreadyAdmin()",
        "ZeroOfferedRate()",
        "AlreadyNotAdmin()",
        "NotValidGalaxyPoolProportion()",
        "NotValidEarlyAccessProportion()",
        "NotAdmin()",
        "ZeroAmount()",
        "ZeroAddress()",
        "NotValidSignature()",
        "NotYetTimeToRedeemTGE()",
        "TimeOutToSetPoolStatus()",
        "Redeemed()",
        "NotInWhaleList(address)",
        "NotAllowedToRedeemTGEIDOAmount()",
        "ExceedMaxPurchaseAmountForUser()",
        "NotEnoughConditionToWithdrawIDOToken()",
        "NotEnoughConditionToWithdrawPurchaseToken()",
        "AlreadySetRedeemableTGE(bool)",
        "ExceedTotalRaiseAmount(address,uint256)",
        "ExceedMaxPurchaseAmountForKYCUser(address,uint256)",
        "ExceedMaxPurchaseAmountForGalaxyPool(address,uint256)",
        "ExceedMaxPurchaseAmountForNotKYCUser(address,uint256)",
        "ExceedMaxPurchaseAmountForEarlyAccess(address,uint256)",
        "NotEnoughAllowance(address,address,uint256,uint256)",
        "NotUpdateValidTime(uint256,uint256,uint256,uint256)",
        "TimeOutToBuyToken(uint256,uint256,uint256,uint256,uint256,address)",
        "getUserRoles(address)",
        "withdrawIDOToken(address)"
    ]

    for (let i=0;i<errArray.length;i++){
        calculateErrorSelector(errArray[i]);
    }

}

main()

/**
 * Result

1f2a2005 ZeroAmount()
d92e233d ZeroAddress()
386d034a AlreadyAdmin()
0912651e ZeroOfferedRate()
e901e0f5 AlreadyNotAdmin()
f8967ebd NotValidGalaxyPoolProportion()
87dbd576 NotValidEarlyAccessProportion()
7bfa4b9f NotAdmin()
1f2a2005 ZeroAmount()
d92e233d ZeroAddress()
e282c0ba NotValidSignature()
0a919d33 NotYetTimeToRedeemTGE()
002ff3b2 TimeOutToSetPoolStatus()
b8cac300 Redeemed()
2e4f414f NotInWhaleList(address)
1b8b49f9 NotAllowedToRedeemTGEIDOAmount()
566f8006 ExceedMaxPurchaseAmountForUser()
b5d02297 NotEnoughConditionToWithdrawIDOToken()
acc436f6 NotEnoughConditionToWithdrawPurchaseToken()
74b927f2 AlreadySetRedeemableTGE(bool)
b17009d3 ExceedTotalRaiseAmount(address,uint256)
1087b521 ExceedMaxPurchaseAmountForKYCUser(address,uint256)
53adc859 ExceedMaxPurchaseAmountForGalaxyPool(address,uint256)
84e66cd1 ExceedMaxPurchaseAmountForNotKYCUser(address,uint256)
30b052c3 ExceedMaxPurchaseAmountForEarlyAccess(address,uint256)
27f700a8 NotEnoughAllowance(address,address,uint256,uint256)
7b30ef5a NotUpdateValidTime(uint256,uint256,uint256,uint256)
c9b550a6 TimeOutToBuyToken(uint256,uint256,uint256,uint256,uint256,address)
06a36aee getUserRoles(address)

 */