# PoolStorage
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/core/PoolStorage.sol)


## State Variables
### WHALE
*keccak256("WHALE")*


```solidity
bytes32 public constant WHALE = 0xed4b80c86c7954bdbf516c492acb4a2899eb0ee85b7c74e26d85e55a07562c95;
```


### NORMAL_USER
*keccak256("NORMAL_USER")*


```solidity
bytes32 public constant NORMAL_USER = 0x13e31188d81b941f4c541528790db4031bef078b78d364bde6fc2d4e5ad79e01;
```


### PERCENTAGE_DENOMINATOR
*Percentage denominator*


```solidity
uint16 public constant PERCENTAGE_DENOMINATOR = 10000;
```


### DOMAIN_SEPARATOR

```solidity
bytes32 public DOMAIN_SEPARATOR;
```


### FUND_TYPEHASH

```solidity
bytes32 public constant FUND_TYPEHASH = 0x52d52760e40624a39bea36339850f64206470d82f714f11095b454fbff6de952;
```


### name
*Name used for fund signature*


```solidity
string public constant name = "Pool";
```


### version
*Version used for fund signature*


```solidity
string public constant version = "1";
```


### ignitionFactory
*Address of pool factory*


```solidity
IIgnitionFactory public ignitionFactory;
```


### purchaseToken
*Address of purchase token*


```solidity
IERC20 public purchaseToken;
```


### offeredCurrency
*Store rate and decimal to display price of IDO token*


```solidity
OfferedCurrency public offeredCurrency;
```


### maxPurchaseAmountForGalaxyPool
*Max purchase amount for galaxy pool = total raise amount * galaxy pool proportion*


```solidity
uint256 public maxPurchaseAmountForGalaxyPool;
```


### maxPurchaseAmountForEarlyAccess
*Max purchase amount for early access = (total raise amount - total raise amount * galaxy pool proportion) * early access proportion*


```solidity
uint256 public maxPurchaseAmountForEarlyAccess;
```


### maxPurchaseAmountForKYCUser
*Max purchase amount for KYC user*


```solidity
uint256 public maxPurchaseAmountForKYCUser;
```


### maxPurchaseAmountForNotKYCUser
*Max purchase amount for NOT KYC user*


```solidity
uint256 public maxPurchaseAmountForNotKYCUser;
```


### tokenFeePercentage
*Token fee to create project*


```solidity
uint16 public tokenFeePercentage;
```


### tokenFeeClaimedStatus
*True if token fee is claimed*


```solidity
bool public tokenFeeClaimedStatus;
```


### galaxyParticipationFeePercentage
*Fee percentage when buying token in galaxy pool*


```solidity
uint16 public galaxyParticipationFeePercentage;
```


### crowdfundingParticipationFeePercentage
*Fee percentage when buying token in crowdfunding pool*


```solidity
uint16 public crowdfundingParticipationFeePercentage;
```


### galaxyPoolProportion
*Proportion of total raise for galaxy pool*


```solidity
uint16 public galaxyPoolProportion;
```


### earlyAccessProportion
*Proportion of crowdfunding pool amount for early access*


```solidity
uint16 public earlyAccessProportion;
```


### totalRaiseAmount
*Total raise amount of all pools (based on purchase token)*


```solidity
uint256 public totalRaiseAmount;
```


### whaleOpenTime
*Open time of galaxy pool*


```solidity
uint64 public whaleOpenTime;
```


### whaleCloseTime
*Close time of galaxy pool*


```solidity
uint64 public whaleCloseTime;
```


### communityOpenTime
*Open time for community user = Close time of galaxy pool*


```solidity
uint64 public communityOpenTime;
```


### communityCloseTime
*Close time of crowdfunding pool*


```solidity
uint64 public communityCloseTime;
```


### participationFeeAmount
*Participation fee in all sub-pool (based on purchase token)*


```solidity
uint256 public participationFeeAmount;
```


### participationFeeClaimedStatus
*True if participation fee is claimed*


```solidity
bool public participationFeeClaimedStatus;
```


### purchasedAmountInGalaxyPool
*Purchased amount in galaxy pool (based on purchase token), do not include participation fee*


```solidity
uint256 public purchasedAmountInGalaxyPool;
```


### purchasedAmountInEarlyAccess
*Purchased amount in early access (based on purchase token), do not include participation fee*


```solidity
uint256 public purchasedAmountInEarlyAccess;
```


### purchasedAmount
*Purchased amount in all pools (based on purchase token), do not include participation fee*


```solidity
uint256 public purchasedAmount;
```


### fundClaimedAmount
*Fund amount which is claimed by collaborator (exclude token fee)*


```solidity
uint256 public fundClaimedAmount;
```


### userPurchasedAmount
*Mapping from User to purchased amount (based on purchase token)*


```solidity
mapping(address => PurchaseAmount) public userPurchasedAmount;
```


### vesting
*Vesting contract address*


```solidity
IVesting public vesting;
```


## Structs
### OfferedCurrency
*rate and decimal to display price of IDO token*


```solidity
struct OfferedCurrency {
    uint256 rate;
    uint256 decimal;
}
```

### PurchaseAmount
*amount of purchase token, fee used to buy IDO token and withdrawn amount status if project failed*


```solidity
struct PurchaseAmount {
    uint256 principal;
    uint256 fee;
    uint256 withdrawn;
}
```

