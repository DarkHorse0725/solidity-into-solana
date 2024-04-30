# BlackList
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDT_ETH.sol)

**Inherits:**
[Ownable](/contracts/test/USDT_BSC.sol/contract.Ownable.md), [BasicToken](/contracts/test/USDT_ETH.sol/contract.BasicToken.md)


## State Variables
### isBlackListed

```solidity
mapping(address => bool) public isBlackListed;
```


## Functions
### getBlackListStatus


```solidity
function getBlackListStatus(address _maker) external view returns (bool);
```

### getOwner


```solidity
function getOwner() external view returns (address);
```

### addBlackList


```solidity
function addBlackList(address _evilUser) public onlyOwner;
```

### removeBlackList


```solidity
function removeBlackList(address _clearedUser) public onlyOwner;
```

### destroyBlackFunds


```solidity
function destroyBlackFunds(address _blackListedUser) public onlyOwner;
```

## Events
### DestroyedBlackFunds

```solidity
event DestroyedBlackFunds(address _blackListedUser, uint256 _balance);
```

### AddedBlackList

```solidity
event AddedBlackList(address _user);
```

### RemovedBlackList

```solidity
event RemovedBlackList(address _user);
```

