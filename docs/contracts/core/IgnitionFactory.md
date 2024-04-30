# IgnitionFactory









## Methods

### DEFAULT_ADMIN_ROLE

```solidity
function DEFAULT_ADMIN_ROLE() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### LOCKUP_DURATION

```solidity
function LOCKUP_DURATION() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### OWNER_ROLE

```solidity
function OWNER_ROLE() external view returns (bytes32)
```

keccak256(&quot;OWNER_ROLE&quot;)




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

### createPool

```solidity
function createPool(address[2] addrs, uint256[18] uints, uint256 dbProjectId) external nonpayable returns (address pool)
```

Create new pool. One pool has 2 sub-pool: galaxy pool and crowfunding pool, with 2 different participation fee. In crowfunding pool, there is a part for WHALE to buy early (called EARLY ACCESS) and another for NORMAL user to buy (called NORMAL ACCESS). Duration of galaxy pool and EARLY ACCESS are same and before duration of NORMAL ACCESS. There are 3 types of fund: PARTICIPATION FEE, TOKEN FEE and COLLABORATOR FUND. Investors need to pay PURCHASE AMOUNT and PARTICIPATION FEE PURCHASE AMOUNT (purchase token) = TOKEN FEE + COLLABORATOR FUND = total raise amount (IDO token) * price Sale End -&gt; TGE Date -&gt; 14 days -&gt; Lockup 14 days is a config variable in the system (constant) If project is success (not be cancelled by admin or funded enough IDO token or not emergency canceled in lockup duration),  - System&#39;s admin claims participation fee and token fee after lockup time    (call pool.claimParticipationFee(), pool.claimTokenFee())  - Collaborator claims collaborator fund (purchased amount - token fee) based on vesting rule after lockup time (vesting schedule start from TGE date)    (call pool.claimFund())  - Investors claim IDO token based on vesting rule after TGE date    (call vesting.claim())  - Collaborator withdraws redundant IDO token after TGE date    (call pool.withdrawRedundantIDOToken()) If project is fail before TGE Date (cancelled by admin or not be funded enough IDO token) (of course before TGE date)  - Investors withdraw purchased amount and participation fee after cancelled time or TGE date    (call pool.withdrawPurchasedAmountAndParticipationFee())  - Collaborator withdraws funded IDO token after cancelled time or TGE date    (call pool.withdrawRedundantIDOToken()) If project is fail after TGE Date and before Lockup time  - Investors claim IDO token based on vesting rule after TGE date and before cancelled time    (call vesting.claim())  - Investors withdraw purchased amount and participation fee at cancelled time    (call pool.withdrawPurchasedAmount())  - Collaborator withdraws redundant IDO token after TGE date and before cancelled time    (call pool.withdrawRedundantIDOToken())  - All remaining IDO will be locked in contract.

*Only has one pool address respectively for one input params*

#### Parameters

| Name | Type | Description |
|---|---|---|
| addrs | address[2] | Array of address includes: - address of IDO token, - address of purchase token |
| uints | uint256[18] | Array of pool information includes: - max purchase amount for KYC user, - max purchase amount for Not KYC user, - token project fee percentage, // will be sent to admin if success or investor in vice versa - galaxy participation fee percentage, // will be sent to admin - crowdfunding participation fee percentage, // will be sent to admin - galaxy pool proportion, (ratio with all project) - early access proportion, (ratio with only crowdfunding pool) - total raise amount, - whale open time, - whale duration, - community duration, - rate of IDO token (based on formula in README), - decimal of IDO token (based on formula in README, is different from decimals in contract of IDO token), - TGE date, - TGE percentage, - vesting cliff, - vesting frequency, - number of vesting release |
| dbProjectId | uint256 | Project Id in database |

#### Returns

| Name | Type | Description |
|---|---|---|
| pool | address | Address of new pool |

### createVesting

```solidity
function createVesting() external nonpayable returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getLockupDuration

```solidity
function getLockupDuration() external pure returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

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

### initialize

```solidity
function initialize(address _poolImplementationAddress, address _vestingImplementationAddress) external nonpayable
```

Initialize pool factory with address of pool implementation

*Called only once*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _poolImplementationAddress | address | Address of pool implementation |
| _vestingImplementationAddress | address | undefined |

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

### paused

```solidity
function paused() external view returns (bool)
```



*Returns true if the contract is paused, and false otherwise.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### poolImplementationAddress

```solidity
function poolImplementationAddress() external view returns (address)
```



*Address of pool implementation*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

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

### setPoolImplementation

```solidity
function setPoolImplementation(address _poolImplementationAddress) external nonpayable
```

Set or change address of pool implementation

*Only admin can can call it*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _poolImplementationAddress | address | Address of new pool implementation |

### setVestingImplementation

```solidity
function setVestingImplementation(address _vestingImplementationAddress) external nonpayable
```

Set or change address of vesting implementation

*Only admin can can call it*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _vestingImplementationAddress | address | Address of new vesting implementation |

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

### vestingImplementationAddress

```solidity
function vestingImplementationAddress() external view returns (address)
```



*Address of vesting implementation*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |



## Events

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

### PoolCreated

```solidity
event PoolCreated(bytes32 poolInfoHash, address pool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| poolInfoHash  | bytes32 | undefined |
| pool  | address | undefined |

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

### UpdatePoolImplementation

```solidity
event UpdatePoolImplementation(address indexed oldPoolImplementation, address indexed newPoolImplementation)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| oldPoolImplementation `indexed` | address | undefined |
| newPoolImplementation `indexed` | address | undefined |

### UpdateVestingImplementation

```solidity
event UpdateVestingImplementation(address indexed oldVestingImplementation, address indexed newVestingImplementation)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| oldVestingImplementation `indexed` | address | undefined |
| newVestingImplementation `indexed` | address | undefined |

### VestingCreated

```solidity
event VestingCreated(address sender, address vesting)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender  | address | undefined |
| vesting  | address | undefined |



