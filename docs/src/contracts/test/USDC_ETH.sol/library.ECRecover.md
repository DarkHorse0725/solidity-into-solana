# ECRecover
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDC_ETH.sol)

Copyright (c) 2016-2019 zOS Global Limited
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

A library that provides a safe ECDSA recovery function


## Functions
### recover

Recover signer's address from a signed message

*Adapted from: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/65e4ffde586ec89af3b7e9140bdc9235d1254853/contracts/cryptography/ECDSA.sol
Modifications: Accept v, r, and s as separate arguments*


```solidity
function recover(bytes32 digest, uint8 v, bytes32 r, bytes32 s) internal pure returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`digest`|`bytes32`|   Keccak-256 hash digest of the signed message|
|`v`|`uint8`|        v of the signature|
|`r`|`bytes32`|        r of the signature|
|`s`|`bytes32`|        s of the signature|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|Signer address|


