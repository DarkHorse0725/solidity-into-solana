# VestingStorage









## Methods

### IDOToken

```solidity
function IDOToken() external view returns (contract IERC20withDec)
```

Address of IDO token




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IERC20withDec | undefined |

### PERCENTAGE_DENOMINATOR

```solidity
function PERCENTAGE_DENOMINATOR() external view returns (uint16)
```

Percentage denominator




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### TGEDate

```solidity
function TGEDate() external view returns (uint64)
```

Time for user to redeem IDO token




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### TGEPercentage

```solidity
function TGEPercentage() external view returns (uint16)
```

Percentage of IDO token amount of user, which can be redeemed after TGEDate




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### claimable

```solidity
function claimable() external view returns (bool)
```

True if admin allow user to claim




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### emergencyCancelled

```solidity
function emergencyCancelled() external view returns (bool)
```



*True if emergency cancelled*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### funded

```solidity
function funded() external view returns (bool)
```

True if collaborator fund enough IDO token




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### numberOfVestingRelease

```solidity
function numberOfVestingRelease() external view returns (uint256)
```

Number of vesting release




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### vestingAmountInfo

```solidity
function vestingAmountInfo(address) external view returns (uint256 totalAmount, uint256 claimedAmount)
```

vesting info of each user



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| totalAmount | uint256 | undefined |
| claimedAmount | uint256 | undefined |

### vestingCliff

```solidity
function vestingCliff() external view returns (uint64)
```

Vesting cliff




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### vestingFrequency

```solidity
function vestingFrequency() external view returns (uint64)
```

Vesting frequency




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |




