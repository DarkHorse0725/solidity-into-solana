# ERC20Token
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/ERC20Token.sol)

**Inherits:**
ERC20PermitUpgradeable


## State Variables
### _decimals

```solidity
uint8 _decimals = 18;
```


## Functions
### initialize


```solidity
function initialize(string memory name, string memory symbol, uint8 decimals_) public initializer;
```

### mint


```solidity
function mint(address _to, uint256 _amount) public;
```

### decimals


```solidity
function decimals() public view override returns (uint8);
```

### setDecimals


```solidity
function setDecimals(uint8 decimals_) public;
```

### burn


```solidity
function burn(address _from, uint256 _amount) public;
```

### _approve


```solidity
function _approve(address owner, address spender, uint256 amount) internal override;
```

