# EIP712
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDC_ETH.sol)

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

A library that provides EIP712 helper functions


## Functions
### makeDomainSeparator

Make EIP712 domain separator


```solidity
function makeDomainSeparator(string memory name, string memory version) internal view returns (bytes32);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`name`|`string`|     Contract name|
|`version`|`string`|  Contract version|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes32`|Domain separator|


### recover

Recover signer's address from a EIP712 signature


```solidity
function recover(bytes32 domainSeparator, uint8 v, bytes32 r, bytes32 s, bytes memory typeHashAndData)
    internal
    pure
    returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`domainSeparator`|`bytes32`|  Domain separator|
|`v`|`uint8`|                v of the signature|
|`r`|`bytes32`|                r of the signature|
|`s`|`bytes32`|                s of the signature|
|`typeHashAndData`|`bytes`|  Type hash concatenated with data|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|Signer's address|


