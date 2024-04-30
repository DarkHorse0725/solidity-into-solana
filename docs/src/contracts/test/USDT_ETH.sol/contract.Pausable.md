# Pausable
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDT_ETH.sol)

**Inherits:**
[Ownable](/contracts/test/USDT_BSC.sol/contract.Ownable.md)

*Base contract which allows children to implement an emergency stop mechanism.*


## State Variables
### paused

```solidity
bool public paused = false;
```


## Functions
### whenNotPaused

*Modifier to make a function callable only when the contract is not paused.*


```solidity
modifier whenNotPaused();
```

### whenPaused

*Modifier to make a function callable only when the contract is paused.*


```solidity
modifier whenPaused();
```

### pause

*called by the owner to pause, triggers stopped state*


```solidity
function pause() public onlyOwner whenNotPaused;
```

### unpause

*called by the owner to unpause, returns to normal state*


```solidity
function unpause() public onlyOwner whenPaused;
```

## Events
### Pause

```solidity
event Pause();
```

### Unpause

```solidity
event Unpause();
```

