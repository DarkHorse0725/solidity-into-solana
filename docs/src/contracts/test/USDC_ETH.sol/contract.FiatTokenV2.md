# FiatTokenV2
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDC_ETH.sol)

**Inherits:**
[FiatTokenV1_1](/contracts/test/USDC_ETH.sol/contract.FiatTokenV1_1.md), [EIP3009](/contracts/test/USDC_ETH.sol/abstract.EIP3009.md), [EIP2612](/contracts/test/USDC_ETH.sol/abstract.EIP2612.md)

Copyright (c) 2018-2020 CENTRE SECZ
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

ERC20 Token backed by fiat reserves, version 2


## State Variables
### _initializedVersion

```solidity
uint8 internal _initializedVersion;
```


## Functions
### initializeV2

Initialize v2


```solidity
function initializeV2(string calldata newName) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newName`|`string`|  New token name|


### increaseAllowance

Increase the allowance by a given increment


```solidity
function increaseAllowance(address spender, uint256 increment) external whenNotPaused returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`spender`|`address`|  Spender's address|
|`increment`|`uint256`|Amount of increase in allowance|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if successful|


### decreaseAllowance

Decrease the allowance by a given decrement


```solidity
function decreaseAllowance(address spender, uint256 decrement) external whenNotPaused returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`spender`|`address`|  Spender's address|
|`decrement`|`uint256`|Amount of decrease in allowance|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if successful|


### transferWithAuthorization

Execute a transfer with a signed authorization


```solidity
function transferWithAuthorization(
    address from,
    address to,
    uint256 value,
    uint256 validAfter,
    uint256 validBefore,
    bytes32 nonce,
    uint8 v,
    bytes32 r,
    bytes32 s
) external whenNotPaused;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`from`|`address`|         Payer's address (Authorizer)|
|`to`|`address`|           Payee's address|
|`value`|`uint256`|        Amount to be transferred|
|`validAfter`|`uint256`|   The time after which this is valid (unix time)|
|`validBefore`|`uint256`|  The time before which this is valid (unix time)|
|`nonce`|`bytes32`|        Unique nonce|
|`v`|`uint8`|            v of the signature|
|`r`|`bytes32`|            r of the signature|
|`s`|`bytes32`|            s of the signature|


### receiveWithAuthorization

Receive a transfer with a signed authorization from the payer

*This has an additional check to ensure that the payee's address
matches the caller of this function to prevent front-running attacks.*


```solidity
function receiveWithAuthorization(
    address from,
    address to,
    uint256 value,
    uint256 validAfter,
    uint256 validBefore,
    bytes32 nonce,
    uint8 v,
    bytes32 r,
    bytes32 s
) external whenNotPaused;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`from`|`address`|         Payer's address (Authorizer)|
|`to`|`address`|           Payee's address|
|`value`|`uint256`|        Amount to be transferred|
|`validAfter`|`uint256`|   The time after which this is valid (unix time)|
|`validBefore`|`uint256`|  The time before which this is valid (unix time)|
|`nonce`|`bytes32`|        Unique nonce|
|`v`|`uint8`|            v of the signature|
|`r`|`bytes32`|            r of the signature|
|`s`|`bytes32`|            s of the signature|


### cancelAuthorization

Attempt to cancel an authorization

*Works only if the authorization is not yet used.*


```solidity
function cancelAuthorization(address authorizer, bytes32 nonce, uint8 v, bytes32 r, bytes32 s) external whenNotPaused;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`authorizer`|`address`|   Authorizer's address|
|`nonce`|`bytes32`|        Nonce of the authorization|
|`v`|`uint8`|            v of the signature|
|`r`|`bytes32`|            r of the signature|
|`s`|`bytes32`|            s of the signature|


### permit

Update allowance with a signed permit


```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
    external
    whenNotPaused;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`owner`|`address`|      Token owner's address (Authorizer)|
|`spender`|`address`|    Spender's address|
|`value`|`uint256`|      Amount of allowance|
|`deadline`|`uint256`|   Expiration time, seconds since the epoch|
|`v`|`uint8`|          v of the signature|
|`r`|`bytes32`|          r of the signature|
|`s`|`bytes32`|          s of the signature|


### _increaseAllowance

Internal function to increase the allowance by a given increment


```solidity
function _increaseAllowance(address owner, address spender, uint256 increment) internal override;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`owner`|`address`|    Token owner's address|
|`spender`|`address`|  Spender's address|
|`increment`|`uint256`|Amount of increase|


### _decreaseAllowance

Internal function to decrease the allowance by a given decrement


```solidity
function _decreaseAllowance(address owner, address spender, uint256 decrement) internal override;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`owner`|`address`|    Token owner's address|
|`spender`|`address`|  Spender's address|
|`decrement`|`uint256`|Amount of decrease|


