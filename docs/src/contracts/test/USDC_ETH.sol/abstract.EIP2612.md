# EIP2612
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

Provide internal implementation for gas-abstracted approvals


## State Variables
### PERMIT_TYPEHASH

```solidity
bytes32 public constant PERMIT_TYPEHASH = 0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;
```


### _permitNonces

```solidity
mapping(address => uint256) private _permitNonces;
```


## Functions
### nonces

Nonces for permit


```solidity
function nonces(address owner) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`owner`|`address`|Token owner's address (Authorizer)|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|Next nonce|


### _permit

Verify a signed approval permit and execute if valid


```solidity
function _permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
    internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`owner`|`address`|    Token owner's address (Authorizer)|
|`spender`|`address`|  Spender's address|
|`value`|`uint256`|    Amount of allowance|
|`deadline`|`uint256`| The time at which this expires (unix time)|
|`v`|`uint8`|        v of the signature|
|`r`|`bytes32`|        r of the signature|
|`s`|`bytes32`|        s of the signature|


