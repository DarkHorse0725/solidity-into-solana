# Rescuable
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDC_ETH.sol)

**Inherits:**
[Ownable](/contracts/test/USDT_BSC.sol/contract.Ownable.md)

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


## State Variables
### _rescuer

```solidity
address private _rescuer;
```


## Functions
### rescuer

Returns current rescuer


```solidity
function rescuer() external view returns (address);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|Rescuer's address|


### onlyRescuer

Revert if called by any account other than the rescuer.


```solidity
modifier onlyRescuer();
```

### rescueERC20

Rescue ERC20 tokens locked up in this contract.


```solidity
function rescueERC20(IERC20 tokenContract, address to, uint256 amount) external onlyRescuer;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`tokenContract`|`IERC20`|ERC20 token contract address|
|`to`|`address`|       Recipient address|
|`amount`|`uint256`|   Amount to withdraw|


### updateRescuer

Assign the rescuer role to a given address.


```solidity
function updateRescuer(address newRescuer) external onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newRescuer`|`address`|New rescuer's address|


## Events
### RescuerChanged

```solidity
event RescuerChanged(address indexed newRescuer);
```

