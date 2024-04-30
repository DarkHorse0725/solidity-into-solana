# Ownable
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDC_ETH.sol)

Copyright (c) 2018 zOS Global Limited.
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

The Ownable contract has an owner address, and provides basic
authorization control functions

*Forked from https://github.com/OpenZeppelin/openzeppelin-labs/blob/3887ab77b8adafba4a26ace002f3a684c1a3388b/upgradeability_ownership/contracts/ownership/Ownable.sol
Modifications:
1. Consolidate OwnableStorage into this contract (7/13/18)
2. Reformat, conform to Solidity 0.6 syntax, and add error messages (5/13/20)
3. Make public functions external (5/27/20)*


## State Variables
### _owner

```solidity
address private _owner;
```


## Functions
### constructor

*The constructor sets the original owner of the contract to the sender account.*


```solidity
constructor() public;
```

### owner

*Tells the address of the owner*


```solidity
function owner() external view returns (address);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|the address of the owner|


### setOwner

*Sets a new owner address*


```solidity
function setOwner(address newOwner) internal;
```

### onlyOwner

*Throws if called by any account other than the owner.*


```solidity
modifier onlyOwner();
```

### transferOwnership

*Allows the current owner to transfer control of the contract to a newOwner.*


```solidity
function transferOwnership(address newOwner) external onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newOwner`|`address`|The address to transfer ownership to.|


## Events
### OwnershipTransferred
*Event to show ownership has been transferred*


```solidity
event OwnershipTransferred(address previousOwner, address newOwner);
```

