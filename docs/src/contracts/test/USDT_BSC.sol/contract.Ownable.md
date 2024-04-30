# Ownable
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDT_BSC.sol)

**Inherits:**
[Context](/contracts/utils/Context.sol/abstract.Context.md)

*Contract module which provides a basic access control mechanism, where
there is an account (an owner) that can be granted exclusive access to
specific functions.
By default, the owner account will be the one that deploys the contract. This
can later be changed with {transferOwnership}.
This module is used through inheritance. It will make available the modifier
`onlyOwner`, which can be applied to your functions to restrict their use to
the owner.*


## State Variables
### _owner

```solidity
address private _owner;
```


## Functions
### constructor

*Initializes the contract setting the deployer as the initial owner.*


```solidity
constructor() internal;
```

### owner

*Returns the address of the current owner.*


```solidity
function owner() public view returns (address);
```

### onlyOwner

*Throws if called by any account other than the owner.*


```solidity
modifier onlyOwner();
```

### renounceOwnership

*Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions anymore. Can only be called by the current owner.
NOTE: Renouncing ownership will leave the contract without an owner,
thereby removing any functionality that is only available to the owner.*


```solidity
function renounceOwnership() public onlyOwner;
```

### transferOwnership

*Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner.*


```solidity
function transferOwnership(address newOwner) public onlyOwner;
```

### _transferOwnership

*Transfers ownership of the contract to a new account (`newOwner`).*


```solidity
function _transferOwnership(address newOwner) internal;
```

## Events
### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
```

