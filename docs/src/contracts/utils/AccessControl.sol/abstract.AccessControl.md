# AccessControl
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/utils/AccessControl.sol)

**Inherits:**
[Context](/contracts/utils/Context.sol/abstract.Context.md), [IAccessControl](/contracts/interfaces/IAccessControl.sol/interface.IAccessControl.md), [ERC165](/contracts/utils/ERC165.sol/abstract.ERC165.md)

*Contract module thatIAccessControl allows children to implement role-based access
control mechanisms. This is a lightweight version that doesn't allow enumerating role
members except through off-chain means by accessing the contract event logs. Some
applications may benefit from on-chain enumerability, for those cases see
{AccessControlEnumerable}.
Roles are referred to by their `bytes32` identifier. These should be exposed
in the external API and be unique. The best way to achieve this is by
using `public constant` hash digests:
```
bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
```
Roles can be used to represent a set of permissions. To restrict access to a
function call, use {hasRole}:
```
function foo() public {
require(hasRole(MY_ROLE, msg.sender));
...
}
```
Roles can be granted and revoked dynamically via the {grantRole} and
{revokeRole} functions. Each role has an associated admin role, and only
accounts that have a role's admin role can call {grantRole} and {revokeRole}.
By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
that only accounts with this role will be able to grant or revoke other
roles. More complex role relationships can be created by using
{_setRoleAdmin}.
WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
grant and revoke this role. Extra precautions should be taken to secure
accounts that have been granted it.*


## State Variables
### _roles

```solidity
mapping(bytes32 => RoleData) private _roles;
```


### DEFAULT_ADMIN_ROLE

```solidity
bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
```


## Functions
### onlyRole

*Modifier that checks that an account has a specific role. Reverts
with a standardized message including the required role.
The format of the revert reason is given by the following regular expression:
/^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
_Available since v4.1._*


```solidity
modifier onlyRole(bytes32 role);
```

### supportsInterface

*See {IERC165-supportsInterface}.*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool);
```

### hasRole

*Returns `true` if `account` has been granted `role`.*


```solidity
function hasRole(bytes32 role, address account) public view virtual override returns (bool);
```

### _checkRole

*Revert with a standard message if `_msgSender()` is missing `role`.
Overriding this function changes the behavior of the {onlyRole} modifier.
Format of the revert message is described in {_checkRole}.
_Available since v4.6._*


```solidity
function _checkRole(bytes32 role) internal view virtual;
```

### _checkRole

*Revert with a standard message if `account` is missing `role`.
The format of the revert reason is given by the following regular expression:
/^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/*


```solidity
function _checkRole(bytes32 role, address account) internal view virtual;
```

### getRoleAdmin

*Returns the admin role that controls `role`. See {grantRole} and
{revokeRole}.
To change a role's admin, use {_setRoleAdmin}.*


```solidity
function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32);
```

### grantRole

*Grants `role` to `account`.
If `account` had not been already granted `role`, emits a {RoleGranted}
event.
Requirements:
- the caller must have ``role``'s admin role.
May emit a {RoleGranted} event.*


```solidity
function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role));
```

### revokeRole

*Revokes `role` from `account`.
If `account` had been granted `role`, emits a {RoleRevoked} event.
Requirements:
- the caller must have ``role``'s admin role.
May emit a {RoleRevoked} event.*


```solidity
function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role));
```

### renounceRole

*Revokes `role` from the calling account.
Roles are often managed via {grantRole} and {revokeRole}: this function's
purpose is to provide a mechanism for accounts to lose their privileges
if they are compromised (such as when a trusted device is misplaced).
If the calling account had been revoked `role`, emits a {RoleRevoked}
event.
Requirements:
- the caller must be `account`.
May emit a {RoleRevoked} event.*


```solidity
function renounceRole(bytes32 role, address account) public virtual override;
```

### _setupRole

*Grants `role` to `account`.
If `account` had not been already granted `role`, emits a {RoleGranted}
event. Note that unlike {grantRole}, this function doesn't perform any
checks on the calling account.
May emit a {RoleGranted} event.
[WARNING]
====
This function should only be called from the constructor when setting
up the initial roles for the system.
Using this function in any other way is effectively circumventing the admin
system imposed by {AccessControl}.
====
NOTE: This function is deprecated in favor of {_grantRole}.*


```solidity
function _setupRole(bytes32 role, address account) internal virtual;
```

### _setRoleAdmin

*Sets `adminRole` as ``role``'s admin role.
Emits a {RoleAdminChanged} event.*


```solidity
function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual;
```

### _grantRole

*Grants `role` to `account`.
Internal function without access restriction.
May emit a {RoleGranted} event.*


```solidity
function _grantRole(bytes32 role, address account) internal virtual;
```

### _revokeRole

*Revokes `role` from `account`.
Internal function without access restriction.
May emit a {RoleRevoked} event.*


```solidity
function _revokeRole(bytes32 role, address account) internal virtual;
```

## Structs
### RoleData

```solidity
struct RoleData {
    mapping(address => bool) members;
    bytes32 adminRole;
}
```

