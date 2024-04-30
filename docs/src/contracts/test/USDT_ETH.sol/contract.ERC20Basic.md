# ERC20Basic
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDT_ETH.sol)

*Simpler version of ERC20 interface*

*see https://github.com/ethereum/EIPs/issues/20*


## State Variables
### _totalSupply

```solidity
uint256 public _totalSupply;
```


## Functions
### totalSupply


```solidity
function totalSupply() public view returns (uint256);
```

### balanceOf


```solidity
function balanceOf(address who) public view returns (uint256);
```

### transfer


```solidity
function transfer(address to, uint256 value) public;
```

## Events
### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
```

