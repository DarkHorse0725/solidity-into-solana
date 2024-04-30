# IgnitionFactory
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/core/IgnitionFactory.sol)

**Inherits:**
[BasePausable](/contracts/core/BasePausable.sol/contract.BasePausable.md)


## State Variables
### poolImplementationAddress
*Address of pool implementation*


```solidity
address public poolImplementationAddress;
```


### vestingImplementationAddress
*Address of vesting implementation*


```solidity
address public vestingImplementationAddress;
```


### LOCKUP_DURATION

```solidity
uint256 public constant LOCKUP_DURATION = 14 days;
```


## Functions
### initialize

Initialize pool factory with address of pool implementation

*Called only once*


```solidity
function initialize(address _poolImplementationAddress, address _vestingImplementationAddress) external initializer;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_poolImplementationAddress`|`address`|Address of pool implementation|
|`_vestingImplementationAddress`|`address`||


### setPoolImplementation

Set or change address of pool implementation

*Only admin can can call it*


```solidity
function setPoolImplementation(address _poolImplementationAddress) external onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_poolImplementationAddress`|`address`|Address of new pool implementation|


### setVestingImplementation

Set or change address of vesting implementation

*Only admin can can call it*


```solidity
function setVestingImplementation(address _vestingImplementationAddress) external onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_vestingImplementationAddress`|`address`|Address of new vesting implementation|


### createPool

Create new pool. One pool has 2 sub-pool: galaxy pool and crowfunding pool, with 2 different participation fee.
In crowfunding pool, there is a part for WHALE to buy early (called EARLY ACCESS) and another for NORMAL user to buy
(called NORMAL ACCESS). Duration of galaxy pool and EARLY ACCESS are same and before duration of NORMAL ACCESS.
There are 3 types of fund: PARTICIPATION FEE, TOKEN FEE and COLLABORATOR FUND.
Investors need to pay PURCHASE AMOUNT and PARTICIPATION FEE
PURCHASE AMOUNT (purchase token) = TOKEN FEE + COLLABORATOR FUND = total raise amount (IDO token) * price
Sale End -> TGE Date -> 14 days -> Lockup
14 days is a config variable in the system (constant)
If project is success (not be cancelled by admin or funded enough IDO token or not emergency canceled in lockup duration),
- System's admin claims participation fee and token fee after lockup time
(call pool.claimParticipationFee(), pool.claimTokenFee())
- Collaborator claims collaborator fund (purchased amount - token fee) based on vesting rule after lockup time (vesting schedule start from TGE date)
(call pool.claimFund())
- Investors claim IDO token based on vesting rule after TGE date
(call vesting.claim())
- Collaborator withdraws redundant IDO token after TGE date
(call pool.withdrawRedundantIDOToken())
If project is fail before TGE Date (cancelled by admin or not be funded enough IDO token) (of course before TGE date)
- Investors withdraw purchased amount and participation fee after cancelled time or TGE date
(call pool.withdrawPurchasedAmountAndParticipationFee())
- Collaborator withdraws funded IDO token after cancelled time or TGE date
(call pool.withdrawRedundantIDOToken())
If project is fail after TGE Date and before Lockup time
- Investors claim IDO token based on vesting rule after TGE date and before cancelled time
(call vesting.claim())
- Investors withdraw purchased amount and participation fee at cancelled time
(call pool.withdrawPurchasedAmount())
- Collaborator withdraws redundant IDO token after TGE date and before cancelled time
(call pool.withdrawRedundantIDOToken())
- All remaining IDO will be locked in contract.

*Only has one pool address respectively for one input params*


```solidity
function createPool(address[2] memory addrs, uint256[18] memory uints, uint256 dbProjectId)
    external
    returns (address pool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`addrs`|`address[2]`|Array of address includes: - address of IDO token, - address of purchase token|
|`uints`|`uint256[18]`|Array of pool information includes: - max purchase amount for KYC user, - max purchase amount for Not KYC user, - token project fee percentage, // will be sent to admin if success or investor in vice versa - galaxy participation fee percentage, // will be sent to admin - crowdfunding participation fee percentage, // will be sent to admin - galaxy pool proportion, (ratio with all project) - early access proportion, (ratio with only crowdfunding pool) - total raise amount, - whale open time, - whale duration, - community duration, - rate of IDO token (based on formula in README), - decimal of IDO token (based on formula in README, is different from decimals in contract of IDO token), - TGE date, - TGE percentage, - vesting cliff, - vesting frequency, - number of vesting release|
|`dbProjectId`|`uint256`|Project Id in database|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`pool`|`address`|Address of new pool|


### createVesting


```solidity
function createVesting() external returns (address);
```

### getLockupDuration


```solidity
function getLockupDuration() public pure returns (uint256);
```

### _validAddress

*Check whether or not an address is zero address*


```solidity
function _validAddress(address _address) internal pure;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_address`|`address`|An address|


## Events
### UpdatePoolImplementation

```solidity
event UpdatePoolImplementation(address indexed oldPoolImplementation, address indexed newPoolImplementation);
```

### UpdateVestingImplementation

```solidity
event UpdateVestingImplementation(address indexed oldVestingImplementation, address indexed newVestingImplementation);
```

### PoolCreated

```solidity
event PoolCreated(bytes32 poolInfoHash, address pool);
```

### VestingCreated

```solidity
event VestingCreated(address sender, address vesting);
```

