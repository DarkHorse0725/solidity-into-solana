# Vesting









## Methods

### DEFAULT_ADMIN_ROLE

```solidity
function DEFAULT_ADMIN_ROLE() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### IDOToken

```solidity
function IDOToken() external view returns (contract IERC20withDec)
```

Address of IDO token




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IERC20withDec | undefined |

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

### __BasePausable__init

```solidity
function __BasePausable__init(address owner) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

### claimIDOToken

```solidity
function claimIDOToken(address _beneficiary) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _beneficiary | address | undefined |

### claimable

```solidity
function claimable() external view returns (bool)
```

True if admin allow user to claim




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### createVestingSchedule

```solidity
function createVestingSchedule(address _user, uint256 _totalAmount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | undefined |
| _totalAmount | uint256 | undefined |

### emergencyCancelled

```solidity
function emergencyCancelled() external view returns (bool)
```






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

### getClaimableAmount

```solidity
function getClaimableAmount(address user) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getIDOToken

```solidity
function getIDOToken() external view returns (contract IERC20withDec)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IERC20withDec | undefined |

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

### getVestingInfo

```solidity
function getVestingInfo() external view returns (uint64, uint16, uint64, uint64, uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |
| _1 | uint16 | undefined |
| _2 | uint64 | undefined |
| _3 | uint64 | undefined |
| _4 | uint256 | undefined |

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
function initialize(address owner, address _IDOToken, uint256 _TGEDate, uint256 _TGEPercentage, uint256 _vestingCliff, uint256 _vestingFrequency, uint256 _numberOfVestingRelease) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |
| _IDOToken | address | undefined |
| _TGEDate | uint256 | undefined |
| _TGEPercentage | uint256 | undefined |
| _vestingCliff | uint256 | undefined |
| _vestingFrequency | uint256 | undefined |
| _numberOfVestingRelease | uint256 | undefined |

### isClaimable

```solidity
function isClaimable() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isEmergencyCancelled

```solidity
function isEmergencyCancelled() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isFunded

```solidity
function isFunded() external view returns (bool)
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

### numberOfVestingRelease

```solidity
function numberOfVestingRelease() external view returns (uint256)
```

Number of vesting release




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### paused

```solidity
function paused() external view returns (bool)
```



*Returns true if the contract is paused, and false otherwise.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

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

### setClaimableStatus

```solidity
function setClaimableStatus(bool _status) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _status | bool | undefined |

### setEmergencyCancelled

```solidity
function setEmergencyCancelled(bool _status) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _status | bool | undefined |

### setFundedStatus

```solidity
function setFundedStatus(bool _status) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _status | bool | undefined |

### setIDOToken

```solidity
function setIDOToken(contract IERC20withDec _IDOToken) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _IDOToken | contract IERC20withDec | undefined |

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

### updateTGEDate

```solidity
function updateTGEDate(uint64 _TGEDate) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _TGEDate | uint64 | undefined |

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

### withdrawRedundantIDOToken

```solidity
function withdrawRedundantIDOToken(address _beneficiary, uint256 _redundantAmount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _beneficiary | address | undefined |
| _redundantAmount | uint256 | undefined |



## Events

### ClaimIDOToken

```solidity
event ClaimIDOToken(address sender, address beneficiary, uint256 claimableAmount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender  | address | undefined |
| beneficiary  | address | undefined |
| claimableAmount  | uint256 | undefined |

### Funded

```solidity
event Funded(bool status)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| status  | bool | undefined |

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

### SetClaimableStatus

```solidity
event SetClaimableStatus(bool status)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| status  | bool | undefined |

### SetEmergencyCancelled

```solidity
event SetEmergencyCancelled(bool status)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| status  | bool | undefined |

### SetIDOTokenAddress

```solidity
event SetIDOTokenAddress(address IDOToken)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| IDOToken  | address | undefined |

### Unpaused

```solidity
event Unpaused(address account)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |

### UpdateTGEDate

```solidity
event UpdateTGEDate(uint64 newTGEDate)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newTGEDate  | uint64 | undefined |

### WithdrawRedundantIDOToken

```solidity
event WithdrawRedundantIDOToken(address beneficiary, uint256 redundantAmount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| beneficiary  | address | undefined |
| redundantAmount  | uint256 | undefined |



