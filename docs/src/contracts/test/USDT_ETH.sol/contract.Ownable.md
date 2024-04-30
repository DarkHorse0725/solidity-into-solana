# Ownable
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDT_ETH.sol)

*The Ownable contract has an owner address, and provides basic authorization control
functions, this simplifies the implementation of "user permissions".*


## State Variables
### owner

```solidity
address public owner;
```


## Functions
### Ownable

*The Ownable constructor sets the original `owner` of the contract to the sender
account.*


```solidity
function Ownable() public;
```

### onlyOwner

*Throws if called by any account other than the owner.*


```solidity
modifier onlyOwner();
```

### transferOwnership

*Allows the current owner to transfer control of the contract to a newOwner.*


```solidity
function transferOwnership(address newOwner) public onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newOwner`|`address`|The address to transfer ownership to.|


