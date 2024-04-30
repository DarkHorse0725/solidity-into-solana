# FiatTokenV2_1
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDC_ETH.sol)

**Inherits:**
[FiatTokenV2](/contracts/test/USDC_ETH.sol/contract.FiatTokenV2.md)

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

ERC20 Token backed by fiat reserves, version 2.1


## Functions
### initializeV2_1

Initialize v2.1


```solidity
function initializeV2_1(address lostAndFound) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`lostAndFound`|`address`| The address to which the locked funds are sent|


### version

Version string for the EIP712 domain separator


```solidity
function version() external pure returns (string memory);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`string`|Version string|


