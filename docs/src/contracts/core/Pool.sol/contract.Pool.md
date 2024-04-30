# Pool
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/core/Pool.sol)

**Inherits:**
[IgnitionList](/contracts/extensions/IgnitionList.sol/contract.IgnitionList.md), [IPool](/contracts/interfaces/IPool.sol/interface.IPool.md), [PoolStorage](/contracts/core/PoolStorage.sol/contract.PoolStorage.md), [BasePausable](/contracts/core/BasePausable.sol/contract.BasePausable.md)


## Functions
### onlyAdmin

*Check whether or not sender of transaction has admin role*


```solidity
modifier onlyAdmin();
```

### onlyFunded


```solidity
modifier onlyFunded();
```

### beforeTGEDate


```solidity
modifier beforeTGEDate();
```

### afterLockupTime


```solidity
modifier afterLockupTime();
```

### notEmergencyCancelled


```solidity
modifier notEmergencyCancelled();
```

### initialize

Initialize a pool with its information


```solidity
function initialize(address[2] memory addrs, uint256[18] memory uints, address owner) external initializer;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`addrs`|`address[2]`|Array of address includes: - address of IDO token, - address of purchase token|
|`uints`|`uint256[18]`|Array of pool information includes: - max purchase amount for KYC user, - max purchase amount for Not KYC user, - token fee percentage, - galaxy participation fee percentage, - crowdfunding participation fee percentage, - galaxy pool proportion, - early access proportion, - total raise amount, - whale open time, - whale duration, - community duration, - rate of IDO token (based on README formula), - decimal of IDO token (based on README formula, is different from decimals in contract of IDO token), - TGE date, - TGE percentage, - vesting cliff, - vesting frequency, - number of vesting release|
|`owner`|`address`||


### setRoot

Set merkle tree root after snapshoting information of investor

*Only admin can call it*


```solidity
function setRoot(bytes32 _root) external onlyAdmin;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_root`|`bytes32`|Root of merkle tree|


### cancelPool

Cancel pool: cancel project, nobody can buy token

*Only admin can call it*


```solidity
function cancelPool(bool _permanentDelete) external onlyAdmin;
```

### updateTime

Update time for galaxy pool and crowdfunding pool

*Only admin can call it, galaxy pool must be closed before crowdfunding pool*


```solidity
function updateTime(uint64 _newWhaleCloseTime, uint64 _newCommunityCloseTime) external onlyAdmin beforeTGEDate;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newWhaleCloseTime`|`uint64`|New close time of galaxy pool|
|`_newCommunityCloseTime`|`uint64`|New close time of crowdfunding pool|


### updateTGEDate


```solidity
function updateTGEDate(uint64 _newTGEDate) external onlyAdmin beforeTGEDate;
```

### buyTokenInGalaxyPool

Investor buy token in galaxy pool

*Must be in time for whale and pool is not closed*


```solidity
function buyTokenInGalaxyPool(bytes32[] memory proof, uint256 _purchaseAmount, uint256 _maxPurchaseBaseOnAllocations)
    external
    whenNotPaused
    nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`proof`|`bytes32[]`|Respective proof for a leaf, which is respective for investor in merkle tree|
|`_purchaseAmount`|`uint256`|Purchase amount of investor|
|`_maxPurchaseBaseOnAllocations`|`uint256`|Max purchase amount base on allocation of whale|


### buyTokenInCrowdfundingPool

Investor buy token in crowdfunding pool

*Must be in time for crowdfunding pool and pool is not closed*


```solidity
function buyTokenInCrowdfundingPool(bytes32[] memory proof, uint256 _purchaseAmount)
    external
    whenNotPaused
    nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`proof`|`bytes32[]`|Respective proof for a leaf, which is respective for investor in merkle tree|
|`_purchaseAmount`|`uint256`|Purchase amount of investor|


### setClaimableStatus


```solidity
function setClaimableStatus(bool _status) external onlyAdmin;
```

### fundIDOToken


```solidity
function fundIDOToken(IERC20withDec _IDOToken, bytes calldata signature)
    external
    onlyOwner
    whenNotPaused
    nonReentrant
    beforeTGEDate;
```

### withdrawRedundantIDOToken


```solidity
function withdrawRedundantIDOToken(address _beneficiary) external onlyOwner;
```

### claimTokenFee

System's admin receive token fee only when project is success after lockup time


```solidity
function claimTokenFee(address _beneficiary)
    external
    onlyAdmin
    whenNotPaused
    onlyFunded
    nonReentrant
    afterLockupTime
    notEmergencyCancelled;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_beneficiary`|`address`|Address to receive|


### claimParticipationFee

System's admin participation token fee only when project is success after lockup time


```solidity
function claimParticipationFee(address _beneficiary)
    external
    onlyAdmin
    whenNotPaused
    onlyFunded
    nonReentrant
    afterLockupTime
    notEmergencyCancelled;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_beneficiary`|`address`|Address to receive|


### withdrawPurchasedAmount

When project is fail (cancelled by admin or not be funded enough IDO token)


```solidity
function withdrawPurchasedAmount(address _beneficiary) external nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_beneficiary`|`address`|Address of receiver|


### claimFund


```solidity
function claimFund(address _beneficiary)
    external
    onlyOwner
    whenNotPaused
    onlyFunded
    nonReentrant
    afterLockupTime
    notEmergencyCancelled;
```

### isFailBeforeTGEDate


```solidity
function isFailBeforeTGEDate() public view returns (bool);
```

### getIDOTokenAmountByOfferedCurrency

*Get IDO token amount base on amount of purchase token*


```solidity
function getIDOTokenAmountByOfferedCurrency(uint256 _amount) public view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_amount`|`uint256`|Amount of purchase token|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|Return amount of respective IDO token|


### getClaimableFundAmount


```solidity
function getClaimableFundAmount() public view returns (uint256);
```

### _createAndSetVesting


```solidity
function _createAndSetVesting(
    address _IDOToken,
    uint256 _TGEDate,
    uint256 _TGEPercentage,
    uint256 _vestingCliff,
    uint256 _vestingFrequency,
    uint256 _numberOfVestingRelease
) internal;
```

### _verifyFundAllowanceSignature


```solidity
function _verifyFundAllowanceSignature(IERC20withDec _IDOToken, bytes calldata signature)
    internal
    view
    returns (bool);
```

### _internalWhaleBuyToken

*Internal function for whale to buy token*


```solidity
function _internalWhaleBuyToken(
    bytes32[] memory proof,
    uint256 _purchaseAmount,
    uint256 _maxPurchaseBaseOnAllocations,
    uint256 _participationFeePercentage,
    uint8 _poolType
) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`proof`|`bytes32[]`|Respective proof for a leaf, which is respective for investor in merkle tree|
|`_purchaseAmount`|`uint256`|Purchase amount of investor|
|`_maxPurchaseBaseOnAllocations`|`uint256`|Max purchase amount base on allocation of whale|
|`_participationFeePercentage`|`uint256`|Fee percentage when buying token|
|`_poolType`|`uint8`|0 for galaxy pool, 1 for early access and 2 for normal user in crowdfunding pool|


### _internalNormalUserBuyToken

*Internal function for normal user to buy token*


```solidity
function _internalNormalUserBuyToken(bytes32[] memory proof, uint256 _purchaseAmount) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`proof`|`bytes32[]`|Respective proof for a leaf, which is respective for investor in merkle tree|
|`_purchaseAmount`|`uint256`|Purchase amount of investor|


### _internalBuyToken

*Internal function to buy token*


```solidity
function _internalBuyToken(
    address buyer,
    uint256 _purchaseAmount,
    uint256 _participationFeePercentage,
    bool _KYCStatus,
    uint8 _poolType
) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`buyer`|`address`|Address of investor|
|`_purchaseAmount`|`uint256`|Purchase amount of investor|
|`_participationFeePercentage`|`uint256`|Fee percentage when buying token|
|`_KYCStatus`|`bool`|True if investor KYC and vice versa|
|`_poolType`|`uint8`|0 for galaxy pool, 1 for early access and 2 for normal user in crowdfunding pool|


### _handlePurchaseTokenFund


```solidity
function _handlePurchaseTokenFund(address _buyer, uint256 _purchaseAmount) internal;
```

### _handleParticipationFee


```solidity
function _handleParticipationFee(address _buyer, uint256 _participationFee) internal;
```

### _forwardParticipationFee


```solidity
function _forwardParticipationFee(address _buyer, uint256 _participationFee) internal;
```

### _updateParticipationFee


```solidity
function _updateParticipationFee(address _buyer, uint256 _participationFee) internal;
```

### _updatePurchasingInGalaxyPoolState

*Update purchasing amount in galaxy pool*


```solidity
function _updatePurchasingInGalaxyPoolState(uint256 _purchaseAmount) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_purchaseAmount`|`uint256`|Purchase amount of investor|


### _updatePurchasingInEarlyAccessState

*Update purchasing amount in early access*


```solidity
function _updatePurchasingInEarlyAccessState(uint256 _purchaseAmount) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_purchaseAmount`|`uint256`|Purchase amount of investor|


### _updatePurchasingState

*Update purchasing amount, airdrop amount and TGE amount in all pools*


```solidity
function _updatePurchasingState(address _buyer, uint256 _purchaseAmount) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_buyer`|`address`||
|`_purchaseAmount`|`uint256`|Purchase amount of investor|


### _forwardPurchaseTokenFunds

*Transfer purchase token from investor to pool*


```solidity
function _forwardPurchaseTokenFunds(address buyer, uint256 _purchaseAmount) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`buyer`|`address`|Address of investor|
|`_purchaseAmount`|`uint256`|Purchase amount of investor|


### _forwardToken


```solidity
function _forwardToken(IERC20withDec token, address sender, address receiver, uint256 amount) internal;
```

### _preValidatePurchaseInEarlyAccess

*Check whether or not purchase amount exceeds max purchase in early access for whale*


```solidity
function _preValidatePurchaseInEarlyAccess(uint256 _purchaseAmount) internal view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_purchaseAmount`|`uint256`|Purchase amount of investor|


### _preValidatePurchase

*Check whether or not purchase amount exceeds amount in all pools*


```solidity
function _preValidatePurchase(uint256 _purchaseAmount) internal view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_purchaseAmount`|`uint256`|Purchase amount of investor|


### _validWhaleSession

*Check whether or not session of whale*


```solidity
function _validWhaleSession() internal view returns (bool);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|Return true if yes, and vice versa|


### _validCommunitySession

*Check whether or not session of community user*


```solidity
function _validCommunitySession() internal view returns (bool);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|Return true if yes, and vice versa|


### _verifyAllowance

*Verify allowance of investor's token for pool*


```solidity
function _verifyAllowance(address _user, uint256 _purchaseAmount) private view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_user`|`address`|Address of investor|
|`_purchaseAmount`|`uint256`|Purchase amount of investor|


### _preValidatePurchaseInGalaxyPool

*Check whether or not purchase amount exceeds max purchase amount base on allocation for whale*


```solidity
function _preValidatePurchaseInGalaxyPool(uint256 _purchaseAmount, uint256 _maxPurchaseBaseOnAllocations)
    internal
    pure;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_purchaseAmount`|`uint256`|Amount of purchase token|
|`_maxPurchaseBaseOnAllocations`|`uint256`|Max purchase amount base on allocations for whale|


## Events
### UpdateRoot

```solidity
event UpdateRoot(bytes32 root);
```

### CancelPool

```solidity
event CancelPool(address indexed pool, bool permanentDeleteStatus);
```

### BuyToken

```solidity
event BuyToken(address indexed buyer, address indexed pool, uint256 purchaseAmount, uint8 poolType);
```

### UpdateTime

```solidity
event UpdateTime(uint64 whaleOpenTime, uint64 whaleCloseTime, uint64 communityOpenTime, uint64 communityCloseTime);
```

### FundIDOToken

```solidity
event FundIDOToken(IERC20withDec IDOToken, uint256 fundAmount);
```

### ClaimTokenFee

```solidity
event ClaimTokenFee(address beneficiary, uint256 tokenFee);
```

### ClaimParticipationFee

```solidity
event ClaimParticipationFee(address beneficiary, uint256 participationFeeAmount);
```

### WithdrawPurchasedAmount

```solidity
event WithdrawPurchasedAmount(address sender, address beneficiary, uint256 principalAmount);
```

### ClaimFund

```solidity
event ClaimFund(address beneficiary, uint256 claimableAmount);
```

