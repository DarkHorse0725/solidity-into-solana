# SafeERC20
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/libraries/SafeERC20.sol)

*Wrappers around ERC20 operations that throw on failure (when the token
contract returns false). Tokens that return no value (and instead revert or
throw on failure) are also supported, non-reverting calls are assumed to be
successful.
To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
which allows you to call the safe operations as `token.safeTransfer(...)`, etc.*


## Functions
### safeTransfer


```solidity
function safeTransfer(IERC20 token, address to, uint256 value) internal;
```

### safeTransferFrom


```solidity
function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal;
```

### safeApprove

*Deprecated. This function has issues similar to the ones found in
{IERC20-approve}, and its usage is discouraged.
Whenever possible, use {safeIncreaseAllowance} and
{safeDecreaseAllowance} instead.*


```solidity
function safeApprove(IERC20 token, address spender, uint256 value) internal;
```

### safeIncreaseAllowance


```solidity
function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal;
```

### safeDecreaseAllowance


```solidity
function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal;
```

### safePermit


```solidity
function safePermit(
    IERC20Permit token,
    address owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
) internal;
```

### _callOptionalReturn

*Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
on the return value: the return value is optional (but if data is returned, it must not be false).*


```solidity
function _callOptionalReturn(IERC20 token, bytes memory data) private;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The token targeted by the call.|
|`data`|`bytes`|The call data (encoded using abi.encode or one of its variants).|


