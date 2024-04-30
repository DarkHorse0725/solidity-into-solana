# Strings
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/libraries/Strings.sol)

*String operations.*


## State Variables
### _HEX_SYMBOLS

```solidity
bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";
```


### _ADDRESS_LENGTH

```solidity
uint8 private constant _ADDRESS_LENGTH = 20;
```


## Functions
### toString

*Converts a `uint256` to its ASCII `string` decimal representation.*


```solidity
function toString(uint256 value) internal pure returns (string memory);
```

### toHexString

*Converts a `uint256` to its ASCII `string` hexadecimal representation.*


```solidity
function toHexString(uint256 value) internal pure returns (string memory);
```

### toHexString

*Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.*


```solidity
function toHexString(uint256 value, uint256 length) internal pure returns (string memory);
```

### toHexString

*Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal representation.*


```solidity
function toHexString(address addr) internal pure returns (string memory);
```

