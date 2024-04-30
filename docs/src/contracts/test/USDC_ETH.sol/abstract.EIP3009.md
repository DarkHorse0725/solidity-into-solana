# EIP3009
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDC_ETH.sol)

**Inherits:**
[AbstractFiatTokenV2](/contracts/test/USDC_ETH.sol/abstract.AbstractFiatTokenV2.md), [EIP712Domain](/contracts/test/USDC_ETH.sol/contract.EIP712Domain.md)

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

Provide internal implementation for gas-abstracted transfers

*Contracts that inherit from this must wrap these with publicly
accessible functions, optionally adding modifiers where necessary*


## State Variables
### TRANSFER_WITH_AUTHORIZATION_TYPEHASH

```solidity
bytes32 public constant TRANSFER_WITH_AUTHORIZATION_TYPEHASH =
    0x7c7c6cdb67a18743f49ec6fa9b35f50d52ed05cbed4cc592e13b44501c1a2267;
```


### RECEIVE_WITH_AUTHORIZATION_TYPEHASH

```solidity
bytes32 public constant RECEIVE_WITH_AUTHORIZATION_TYPEHASH =
    0xd099cc98ef71107a616c4f0f941f04c322d8e254fe26b3c6668db87aae413de8;
```


### CANCEL_AUTHORIZATION_TYPEHASH

```solidity
bytes32 public constant CANCEL_AUTHORIZATION_TYPEHASH =
    0x158b0a9edf7a828aad02f63cd515c68ef2f50ba807396f6d12842833a1597429;
```


### _authorizationStates
*authorizer address => nonce => bool (true if nonce is used)*


```solidity
mapping(address => mapping(bytes32 => bool)) private _authorizationStates;
```


## Functions
### authorizationState

Returns the state of an authorization

*Nonces are randomly generated 32-byte data unique to the
authorizer's address*


```solidity
function authorizationState(address authorizer, bytes32 nonce) external view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`authorizer`|`address`|   Authorizer's address|
|`nonce`|`bytes32`|        Nonce of the authorization|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the nonce is used|


### _transferWithAuthorization

Execute a transfer with a signed authorization


```solidity
function _transferWithAuthorization(
    address from,
    address to,
    uint256 value,
    uint256 validAfter,
    uint256 validBefore,
    bytes32 nonce,
    uint8 v,
    bytes32 r,
    bytes32 s
) internal;
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


### _receiveWithAuthorization

Receive a transfer with a signed authorization from the payer

*This has an additional check to ensure that the payee's address
matches the caller of this function to prevent front-running attacks.*


```solidity
function _receiveWithAuthorization(
    address from,
    address to,
    uint256 value,
    uint256 validAfter,
    uint256 validBefore,
    bytes32 nonce,
    uint8 v,
    bytes32 r,
    bytes32 s
) internal;
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


### _cancelAuthorization

Attempt to cancel an authorization


```solidity
function _cancelAuthorization(address authorizer, bytes32 nonce, uint8 v, bytes32 r, bytes32 s) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`authorizer`|`address`|   Authorizer's address|
|`nonce`|`bytes32`|        Nonce of the authorization|
|`v`|`uint8`|            v of the signature|
|`r`|`bytes32`|            r of the signature|
|`s`|`bytes32`|            s of the signature|


### _requireUnusedAuthorization

Check that an authorization is unused


```solidity
function _requireUnusedAuthorization(address authorizer, bytes32 nonce) private view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`authorizer`|`address`|   Authorizer's address|
|`nonce`|`bytes32`|        Nonce of the authorization|


### _requireValidAuthorization

Check that authorization is valid


```solidity
function _requireValidAuthorization(address authorizer, bytes32 nonce, uint256 validAfter, uint256 validBefore)
    private
    view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`authorizer`|`address`|   Authorizer's address|
|`nonce`|`bytes32`|        Nonce of the authorization|
|`validAfter`|`uint256`|   The time after which this is valid (unix time)|
|`validBefore`|`uint256`|  The time before which this is valid (unix time)|


### _markAuthorizationAsUsed

Mark an authorization as used


```solidity
function _markAuthorizationAsUsed(address authorizer, bytes32 nonce) private;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`authorizer`|`address`|   Authorizer's address|
|`nonce`|`bytes32`|        Nonce of the authorization|


## Events
### AuthorizationUsed

```solidity
event AuthorizationUsed(address indexed authorizer, bytes32 indexed nonce);
```

### AuthorizationCanceled

```solidity
event AuthorizationCanceled(address indexed authorizer, bytes32 indexed nonce);
```

