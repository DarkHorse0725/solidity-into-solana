# PoolStorage









## Methods

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### FUND_TYPEHASH

```solidity
function FUND_TYPEHASH() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### NORMAL_USER

```solidity
function NORMAL_USER() external view returns (bytes32)
```



*keccak256(&quot;NORMAL_USER&quot;)*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### PERCENTAGE_DENOMINATOR

```solidity
function PERCENTAGE_DENOMINATOR() external view returns (uint16)
```



*Percentage denominator*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### WHALE

```solidity
function WHALE() external view returns (bytes32)
```



*keccak256(&quot;WHALE&quot;)*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### communityCloseTime

```solidity
function communityCloseTime() external view returns (uint64)
```



*Close time of crowdfunding pool*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### communityOpenTime

```solidity
function communityOpenTime() external view returns (uint64)
```



*Open time for community user = Close time of galaxy pool*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### crowdfundingParticipationFeePercentage

```solidity
function crowdfundingParticipationFeePercentage() external view returns (uint16)
```



*Fee percentage when buying token in crowdfunding pool*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### earlyAccessProportion

```solidity
function earlyAccessProportion() external view returns (uint16)
```



*Proportion of crowdfunding pool amount for early access*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### fundClaimedAmount

```solidity
function fundClaimedAmount() external view returns (uint256)
```



*Fund amount which is claimed by collaborator (exclude token fee)*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### galaxyParticipationFeePercentage

```solidity
function galaxyParticipationFeePercentage() external view returns (uint16)
```



*Fee percentage when buying token in galaxy pool*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### galaxyPoolProportion

```solidity
function galaxyPoolProportion() external view returns (uint16)
```



*Proportion of total raise for galaxy pool*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### ignitionFactory

```solidity
function ignitionFactory() external view returns (contract IIgnitionFactory)
```



*Address of pool factory*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IIgnitionFactory | undefined |

### maxPurchaseAmountForEarlyAccess

```solidity
function maxPurchaseAmountForEarlyAccess() external view returns (uint256)
```



*Max purchase amount for early access = (total raise amount - total raise amount * galaxy pool proportion) * early access proportion*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### maxPurchaseAmountForGalaxyPool

```solidity
function maxPurchaseAmountForGalaxyPool() external view returns (uint256)
```



*Max purchase amount for galaxy pool = total raise amount * galaxy pool proportion*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### maxPurchaseAmountForKYCUser

```solidity
function maxPurchaseAmountForKYCUser() external view returns (uint256)
```



*Max purchase amount for KYC user*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### maxPurchaseAmountForNotKYCUser

```solidity
function maxPurchaseAmountForNotKYCUser() external view returns (uint256)
```



*Max purchase amount for NOT KYC user*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### name

```solidity
function name() external view returns (string)
```



*Name used for fund signature*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### offeredCurrency

```solidity
function offeredCurrency() external view returns (uint256 rate, uint256 decimal)
```



*Store rate and decimal to display price of IDO token*


#### Returns

| Name | Type | Description |
|---|---|---|
| rate | uint256 | undefined |
| decimal | uint256 | undefined |

### participationFeeAmount

```solidity
function participationFeeAmount() external view returns (uint256)
```



*Participation fee in all sub-pool (based on purchase token)*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### participationFeeClaimedStatus

```solidity
function participationFeeClaimedStatus() external view returns (bool)
```



*True if participation fee is claimed*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### purchaseToken

```solidity
function purchaseToken() external view returns (contract IERC20)
```



*Address of purchase token*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IERC20 | undefined |

### purchasedAmount

```solidity
function purchasedAmount() external view returns (uint256)
```



*Purchased amount in all pools (based on purchase token), do not include participation fee*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### purchasedAmountInEarlyAccess

```solidity
function purchasedAmountInEarlyAccess() external view returns (uint256)
```



*Purchased amount in early access (based on purchase token), do not include participation fee*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### purchasedAmountInGalaxyPool

```solidity
function purchasedAmountInGalaxyPool() external view returns (uint256)
```



*Purchased amount in galaxy pool (based on purchase token), do not include participation fee*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### tokenFeeClaimedStatus

```solidity
function tokenFeeClaimedStatus() external view returns (bool)
```



*True if token fee is claimed*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### tokenFeePercentage

```solidity
function tokenFeePercentage() external view returns (uint16)
```



*Token fee to create project*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### totalRaiseAmount

```solidity
function totalRaiseAmount() external view returns (uint256)
```



*Total raise amount of all pools (based on purchase token)*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### userPurchasedAmount

```solidity
function userPurchasedAmount(address) external view returns (uint256 principal, uint256 fee, uint256 withdrawn)
```



*Mapping from User to purchased amount (based on purchase token)*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| principal | uint256 | undefined |
| fee | uint256 | undefined |
| withdrawn | uint256 | undefined |

### version

```solidity
function version() external view returns (string)
```



*Version used for fund signature*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### vesting

```solidity
function vesting() external view returns (contract IVesting)
```



*Vesting contract address*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IVesting | undefined |

### whaleCloseTime

```solidity
function whaleCloseTime() external view returns (uint64)
```



*Close time of galaxy pool*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### whaleOpenTime

```solidity
function whaleOpenTime() external view returns (uint64)
```



*Open time of galaxy pool*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |




