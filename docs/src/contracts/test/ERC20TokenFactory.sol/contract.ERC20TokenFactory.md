# ERC20TokenFactory
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/ERC20TokenFactory.sol)


## State Variables
### mockTokenAddress

```solidity
address public mockTokenAddress;
```


### currentToken

```solidity
address public currentToken;
```


## Functions
### constructor


```solidity
constructor(address _mockTokenAddress);
```

### setMockTokenAddress


```solidity
function setMockTokenAddress(address _newMockTokenAddress) public;
```

### createToken


```solidity
function createToken(string memory name, string memory symbol, uint8 decimal_) public returns (address);
```

## Events
### CreateToken

```solidity
event CreateToken(uint256 timestamp, address newToken, address creator);
```

