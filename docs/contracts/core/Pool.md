# Pool









## Methods

### DEFAULT_ADMIN_ROLE

```solidity
function DEFAULT_ADMIN_ROLE() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

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






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### OWNER_ROLE

```solidity
function OWNER_ROLE() external view returns (bytes32)
```

keccak256(&quot;OWNER_ROLE&quot;)




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### PERCENTAGE_DENOMINATOR

```solidity
function PERCENTAGE_DENOMINATOR() external view returns (uint16)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### WHALE

```solidity
function WHALE() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### __BasePausable__init

```solidity
function __BasePausable__init(address owner) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

### buyTokenInCrowdfundingPool

```solidity
function buyTokenInCrowdfundingPool(bytes32[] proof, uint256 _purchaseAmount) external nonpayable
```

Investor buy token in crowdfunding pool

*Must be in time for crowdfunding pool and pool is not closed*

#### Parameters

| Name | Type | Description |
|---|---|---|
| proof | bytes32[] | Respective proof for a leaf, which is respective for investor in merkle tree |
| _purchaseAmount | uint256 | Purchase amount of investor |

### buyTokenInGalaxyPool

```solidity
function buyTokenInGalaxyPool(bytes32[] proof, uint256 _purchaseAmount, uint256 _maxPurchaseBaseOnAllocations) external nonpayable
```

Investor buy token in galaxy pool

*Must be in time for whale and pool is not closed*

#### Parameters

| Name | Type | Description |
|---|---|---|
| proof | bytes32[] | Respective proof for a leaf, which is respective for investor in merkle tree |
| _purchaseAmount | uint256 | Purchase amount of investor |
| _maxPurchaseBaseOnAllocations | uint256 | Max purchase amount base on allocation of whale |

### cancelPool

```solidity
function cancelPool(bool _permanentDelete) external nonpayable
```

Cancel pool: cancel project, nobody can buy token

*Only admin can call it*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _permanentDelete | bool | undefined |

### claimFund

```solidity
function claimFund(address _beneficiary) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _beneficiary | address | undefined |

### claimParticipationFee

```solidity
function claimParticipationFee(address _beneficiary) external nonpayable
```

System&#39;s admin participation token fee only when project is success after lockup time



#### Parameters

| Name | Type | Description |
|---|---|---|
| _beneficiary | address | Address to receive |

### claimTokenFee

```solidity
function claimTokenFee(address _beneficiary) external nonpayable
```

System&#39;s admin receive token fee only when project is success after lockup time



#### Parameters

| Name | Type | Description |
|---|---|---|
| _beneficiary | address | Address to receive |

### communityCloseTime

```solidity
function communityCloseTime() external view returns (uint64)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### communityOpenTime

```solidity
function communityOpenTime() external view returns (uint64)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### crowdfundingParticipationFeePercentage

```solidity
function crowdfundingParticipationFeePercentage() external view returns (uint16)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### earlyAccessProportion

```solidity
function earlyAccessProportion() external view returns (uint16)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### fundClaimedAmount

```solidity
function fundClaimedAmount() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### fundIDOToken

```solidity
function fundIDOToken(contract IERC20withDec _IDOToken, bytes signature) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _IDOToken | contract IERC20withDec | undefined |
| signature | bytes | undefined |

### galaxyParticipationFeePercentage

```solidity
function galaxyParticipationFeePercentage() external view returns (uint16)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### galaxyPoolProportion

```solidity
function galaxyPoolProportion() external view returns (uint16)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### getClaimableFundAmount

```solidity
function getClaimableFundAmount() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getIDOTokenAmountByOfferedCurrency

```solidity
function getIDOTokenAmountByOfferedCurrency(uint256 _amount) external view returns (uint256)
```



*Get IDO token amount base on amount of purchase token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _amount | uint256 | Amount of purchase token |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Return amount of respective IDO token |

### getRoleAdmin

```solidity
function getRoleAdmin(bytes32 role) external view returns (bytes32)
```



*Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role&#39;s admin, use {_setRoleAdmin}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### grantRole

```solidity
function grantRole(bytes32 role, address account) external nonpayable
```



*Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``&#39;s admin role. May emit a {RoleGranted} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### hasRole

```solidity
function hasRole(bytes32 role, address account) external view returns (bool)
```



*Returns `true` if `account` has been granted `role`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### ignitionFactory

```solidity
function ignitionFactory() external view returns (contract IIgnitionFactory)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IIgnitionFactory | undefined |

### initialize

```solidity
function initialize(address[2] addrs, uint256[18] uints, address owner) external nonpayable
```

Initialize a pool with its information



#### Parameters

| Name | Type | Description |
|---|---|---|
| addrs | address[2] | Array of address includes: - address of IDO token, - address of purchase token |
| uints | uint256[18] | Array of pool information includes: - max purchase amount for KYC user, - max purchase amount for Not KYC user, - token fee percentage, - galaxy participation fee percentage, - crowdfunding participation fee percentage, - galaxy pool proportion, - early access proportion, - total raise amount, - whale open time, - whale duration, - community duration, - rate of IDO token (based on README formula), - decimal of IDO token (based on README formula, is different from decimals in contract of IDO token), - TGE date, - TGE percentage, - vesting cliff, - vesting frequency, - number of vesting release |
| owner | address | undefined |

### isFailBeforeTGEDate

```solidity
function isFailBeforeTGEDate() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isOwner

```solidity
function isOwner(address sender) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### maxPurchaseAmountForEarlyAccess

```solidity
function maxPurchaseAmountForEarlyAccess() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### maxPurchaseAmountForGalaxyPool

```solidity
function maxPurchaseAmountForGalaxyPool() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### maxPurchaseAmountForKYCUser

```solidity
function maxPurchaseAmountForKYCUser() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### maxPurchaseAmountForNotKYCUser

```solidity
function maxPurchaseAmountForNotKYCUser() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### name

```solidity
function name() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### offeredCurrency

```solidity
function offeredCurrency() external view returns (uint256 rate, uint256 decimal)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| rate | uint256 | undefined |
| decimal | uint256 | undefined |

### participationFeeAmount

```solidity
function participationFeeAmount() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### participationFeeClaimedStatus

```solidity
function participationFeeClaimedStatus() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### paused

```solidity
function paused() external view returns (bool)
```



*Returns true if the contract is paused, and false otherwise.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### purchaseToken

```solidity
function purchaseToken() external view returns (contract IERC20)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IERC20 | undefined |

### purchasedAmount

```solidity
function purchasedAmount() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### purchasedAmountInEarlyAccess

```solidity
function purchasedAmountInEarlyAccess() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### purchasedAmountInGalaxyPool

```solidity
function purchasedAmountInGalaxyPool() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### renounceRole

```solidity
function renounceRole(bytes32 role, address account) external nonpayable
```



*Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function&#39;s purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`. May emit a {RoleRevoked} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### revokeRole

```solidity
function revokeRole(bytes32 role, address account) external nonpayable
```



*Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``&#39;s admin role. May emit a {RoleRevoked} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### root

```solidity
function root() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### setClaimableStatus

```solidity
function setClaimableStatus(bool _status) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _status | bool | undefined |

### setRoot

```solidity
function setRoot(bytes32 _root) external nonpayable
```

Set merkle tree root after snapshoting information of investor

*Only admin can call it*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _root | bytes32 | Root of merkle tree |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```



*See {IERC165-supportsInterface}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interfaceId | bytes4 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### tokenFeeClaimedStatus

```solidity
function tokenFeeClaimedStatus() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### tokenFeePercentage

```solidity
function tokenFeePercentage() external view returns (uint16)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint16 | undefined |

### totalRaiseAmount

```solidity
function totalRaiseAmount() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### updateTGEDate

```solidity
function updateTGEDate(uint64 _newTGEDate) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _newTGEDate | uint64 | undefined |

### updateTime

```solidity
function updateTime(uint64 _newWhaleCloseTime, uint64 _newCommunityCloseTime) external nonpayable
```

Update time for galaxy pool and crowdfunding pool

*Only admin can call it, galaxy pool must be closed before crowdfunding pool*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _newWhaleCloseTime | uint64 | New close time of galaxy pool |
| _newCommunityCloseTime | uint64 | New close time of crowdfunding pool |

### userPurchasedAmount

```solidity
function userPurchasedAmount(address) external view returns (uint256 principal, uint256 fee, uint256 withdrawn)
```





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






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### vesting

```solidity
function vesting() external view returns (contract IVesting)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IVesting | undefined |

### whaleCloseTime

```solidity
function whaleCloseTime() external view returns (uint64)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### whaleOpenTime

```solidity
function whaleOpenTime() external view returns (uint64)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### withdrawPurchasedAmount

```solidity
function withdrawPurchasedAmount(address _beneficiary) external nonpayable
```

When project is fail (cancelled by admin or not be funded enough IDO token)



#### Parameters

| Name | Type | Description |
|---|---|---|
| _beneficiary | address | Address of receiver |

### withdrawRedundantIDOToken

```solidity
function withdrawRedundantIDOToken(address _beneficiary) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _beneficiary | address | undefined |



## Events

### BuyToken

```solidity
event BuyToken(address indexed buyer, address indexed pool, uint256 purchaseAmount, uint8 poolType)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| buyer `indexed` | address | undefined |
| pool `indexed` | address | undefined |
| purchaseAmount  | uint256 | undefined |
| poolType  | uint8 | undefined |

### CancelPool

```solidity
event CancelPool(address indexed pool, bool permanentDeleteStatus)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| pool `indexed` | address | undefined |
| permanentDeleteStatus  | bool | undefined |

### ClaimFund

```solidity
event ClaimFund(address beneficiary, uint256 claimableAmount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| beneficiary  | address | undefined |
| claimableAmount  | uint256 | undefined |

### ClaimParticipationFee

```solidity
event ClaimParticipationFee(address beneficiary, uint256 participationFeeAmount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| beneficiary  | address | undefined |
| participationFeeAmount  | uint256 | undefined |

### ClaimTokenFee

```solidity
event ClaimTokenFee(address beneficiary, uint256 tokenFee)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| beneficiary  | address | undefined |
| tokenFee  | uint256 | undefined |

### FundIDOToken

```solidity
event FundIDOToken(contract IERC20withDec IDOToken, uint256 fundAmount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| IDOToken  | contract IERC20withDec | undefined |
| fundAmount  | uint256 | undefined |

### Initialized

```solidity
event Initialized(uint8 version)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

### Paused

```solidity
event Paused(address account)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |

### RoleAdminChanged

```solidity
event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| previousAdminRole `indexed` | bytes32 | undefined |
| newAdminRole `indexed` | bytes32 | undefined |

### RoleGranted

```solidity
event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| account `indexed` | address | undefined |
| sender `indexed` | address | undefined |

### RoleRevoked

```solidity
event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| account `indexed` | address | undefined |
| sender `indexed` | address | undefined |

### Unpaused

```solidity
event Unpaused(address account)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |

### UpdateRoot

```solidity
event UpdateRoot(bytes32 root)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| root  | bytes32 | undefined |

### UpdateTime

```solidity
event UpdateTime(uint64 whaleOpenTime, uint64 whaleCloseTime, uint64 communityOpenTime, uint64 communityCloseTime)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| whaleOpenTime  | uint64 | undefined |
| whaleCloseTime  | uint64 | undefined |
| communityOpenTime  | uint64 | undefined |
| communityCloseTime  | uint64 | undefined |

### WithdrawPurchasedAmount

```solidity
event WithdrawPurchasedAmount(address sender, address beneficiary, uint256 principalAmount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender  | address | undefined |
| beneficiary  | address | undefined |
| principalAmount  | uint256 | undefined |



