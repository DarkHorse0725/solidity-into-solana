# PoolLogic
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/logics/PoolLogic.sol)


## State Variables
### PERCENTAGE_DENOMINATOR
*Percentage denominator*


```solidity
uint16 public constant PERCENTAGE_DENOMINATOR = 10000;
```


## Functions
### calculateParticipantFee

*Calculate fee when investor buy token*


```solidity
function calculateParticipantFee(uint256 _purchaseAmount, uint256 _participationFeePercentage)
    external
    pure
    returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_purchaseAmount`|`uint256`|Purchase amount of investor|
|`_participationFeePercentage`|`uint256`|Fee percentage when buying token|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|Return amount of fee when investor buy token|


### validAmount

*Check whether or not an amount greater than 0*


```solidity
function validAmount(uint256 _amount) public pure;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_amount`|`uint256`|An amount|


### validAddress

*Check whether or not an address is zero address*


```solidity
function validAddress(address _address) public pure;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_address`|`address`|An address|


### verifyPoolInfo

*verify information of pool*


```solidity
function verifyPoolInfo(address[2] memory addrs, uint256[18] memory uints) external pure;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`addrs`|`address[2]`|Array of address includes: - address of IDO token, - address of purchase token|
|`uints`|`uint256[18]`|Array of pool information includes: - max purchase amount for KYC user, - max purchase amount for Not KYC user, - token fee percentage, - galaxy participation fee percentage, - crowdfunding participation fee percentage, - galaxy pool proportion, - early access proportion, - total raise amount, - whale open time, - whale duration, - community duration, - rate of IDO token (based on README formula), - decimal of IDO token (based on README formula, is different from decimals in contract of IDO token), - TGE date, - TGE percentage, - vesting cliff, - vesting frequency, - number of vesting release|


## Enums
### PoolType

```solidity
enum PoolType {
    GALAXY_POOL,
    EARLY_ACCESS,
    NORMAL_ACCESS
}
```

