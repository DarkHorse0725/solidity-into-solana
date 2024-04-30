# TetherToken
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDT_ETH.sol)

**Inherits:**
[Pausable](/contracts/utils/Pausable.sol/abstract.Pausable.md), [StandardToken](/contracts/test/USDT_ETH.sol/contract.StandardToken.md), [BlackList](/contracts/test/USDT_ETH.sol/contract.BlackList.md)


## State Variables
### name

```solidity
string public name;
```


### symbol

```solidity
string public symbol;
```


### decimals

```solidity
uint256 public decimals;
```


### upgradedAddress

```solidity
address public upgradedAddress;
```


### deprecated

```solidity
bool public deprecated;
```


## Functions
### TetherToken


```solidity
function TetherToken(uint256 _initialSupply, string _name, string _symbol, uint256 _decimals) public;
```

### transfer


```solidity
function transfer(address _to, uint256 _value) public whenNotPaused;
```

### transferFrom


```solidity
function transferFrom(address _from, address _to, uint256 _value) public whenNotPaused;
```

### balanceOf


```solidity
function balanceOf(address who) public view returns (uint256);
```

### approve


```solidity
function approve(address _spender, uint256 _value) public onlyPayloadSize(2 * 32);
```

### allowance


```solidity
function allowance(address _owner, address _spender) public view returns (uint256 remaining);
```

### deprecate


```solidity
function deprecate(address _upgradedAddress) public onlyOwner;
```

### totalSupply


```solidity
function totalSupply() public view returns (uint256);
```

### issue


```solidity
function issue(uint256 amount) public onlyOwner;
```

### redeem


```solidity
function redeem(uint256 amount) public onlyOwner;
```

### setParams


```solidity
function setParams(uint256 newBasisPoints, uint256 newMaxFee) public onlyOwner;
```

## Events
### Issue

```solidity
event Issue(uint256 amount);
```

### Redeem

```solidity
event Redeem(uint256 amount);
```

### Deprecate

```solidity
event Deprecate(address newAddress);
```

### Params

```solidity
event Params(uint256 feeBasisPoints, uint256 maxFee);
```

