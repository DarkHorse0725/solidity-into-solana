# SafeCast
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/libraries/SafeCast.sol)

*Wrappers over Solidity's uintXX/intXX casting operators with added overflow
checks.
Downcasting from uint256/int256 in Solidity does not revert on overflow. This can
easily result in undesired exploitation or bugs, since developers usually
assume that overflows raise errors. `SafeCast` restores this intuition by
reverting the transaction when such an operation overflows.
Using this library instead of the unchecked operations eliminates an entire
class of bugs, so it's recommended to use it always.
Can be combined with {SafeMath} and {SignedSafeMath} to extend it to smaller types, by performing
all math on `uint256` and `int256` and then downcasting.*


## Functions
### toUint248

*Returns the downcasted uint248 from uint256, reverting on
overflow (when the input is greater than largest uint248).
Counterpart to Solidity's `uint248` operator.
Requirements:
- input must fit into 248 bits
_Available since v4.7._*


```solidity
function toUint248(uint256 value) internal pure returns (uint248);
```

### toUint240

*Returns the downcasted uint240 from uint256, reverting on
overflow (when the input is greater than largest uint240).
Counterpart to Solidity's `uint240` operator.
Requirements:
- input must fit into 240 bits
_Available since v4.7._*


```solidity
function toUint240(uint256 value) internal pure returns (uint240);
```

### toUint232

*Returns the downcasted uint232 from uint256, reverting on
overflow (when the input is greater than largest uint232).
Counterpart to Solidity's `uint232` operator.
Requirements:
- input must fit into 232 bits
_Available since v4.7._*


```solidity
function toUint232(uint256 value) internal pure returns (uint232);
```

### toUint224

*Returns the downcasted uint224 from uint256, reverting on
overflow (when the input is greater than largest uint224).
Counterpart to Solidity's `uint224` operator.
Requirements:
- input must fit into 224 bits
_Available since v4.2._*


```solidity
function toUint224(uint256 value) internal pure returns (uint224);
```

### toUint216

*Returns the downcasted uint216 from uint256, reverting on
overflow (when the input is greater than largest uint216).
Counterpart to Solidity's `uint216` operator.
Requirements:
- input must fit into 216 bits
_Available since v4.7._*


```solidity
function toUint216(uint256 value) internal pure returns (uint216);
```

### toUint208

*Returns the downcasted uint208 from uint256, reverting on
overflow (when the input is greater than largest uint208).
Counterpart to Solidity's `uint208` operator.
Requirements:
- input must fit into 208 bits
_Available since v4.7._*


```solidity
function toUint208(uint256 value) internal pure returns (uint208);
```

### toUint200

*Returns the downcasted uint200 from uint256, reverting on
overflow (when the input is greater than largest uint200).
Counterpart to Solidity's `uint200` operator.
Requirements:
- input must fit into 200 bits
_Available since v4.7._*


```solidity
function toUint200(uint256 value) internal pure returns (uint200);
```

### toUint192

*Returns the downcasted uint192 from uint256, reverting on
overflow (when the input is greater than largest uint192).
Counterpart to Solidity's `uint192` operator.
Requirements:
- input must fit into 192 bits
_Available since v4.7._*


```solidity
function toUint192(uint256 value) internal pure returns (uint192);
```

### toUint184

*Returns the downcasted uint184 from uint256, reverting on
overflow (when the input is greater than largest uint184).
Counterpart to Solidity's `uint184` operator.
Requirements:
- input must fit into 184 bits
_Available since v4.7._*


```solidity
function toUint184(uint256 value) internal pure returns (uint184);
```

### toUint176

*Returns the downcasted uint176 from uint256, reverting on
overflow (when the input is greater than largest uint176).
Counterpart to Solidity's `uint176` operator.
Requirements:
- input must fit into 176 bits
_Available since v4.7._*


```solidity
function toUint176(uint256 value) internal pure returns (uint176);
```

### toUint168

*Returns the downcasted uint168 from uint256, reverting on
overflow (when the input is greater than largest uint168).
Counterpart to Solidity's `uint168` operator.
Requirements:
- input must fit into 168 bits
_Available since v4.7._*


```solidity
function toUint168(uint256 value) internal pure returns (uint168);
```

### toUint160

*Returns the downcasted uint160 from uint256, reverting on
overflow (when the input is greater than largest uint160).
Counterpart to Solidity's `uint160` operator.
Requirements:
- input must fit into 160 bits
_Available since v4.7._*


```solidity
function toUint160(uint256 value) internal pure returns (uint160);
```

### toUint152

*Returns the downcasted uint152 from uint256, reverting on
overflow (when the input is greater than largest uint152).
Counterpart to Solidity's `uint152` operator.
Requirements:
- input must fit into 152 bits
_Available since v4.7._*


```solidity
function toUint152(uint256 value) internal pure returns (uint152);
```

### toUint144

*Returns the downcasted uint144 from uint256, reverting on
overflow (when the input is greater than largest uint144).
Counterpart to Solidity's `uint144` operator.
Requirements:
- input must fit into 144 bits
_Available since v4.7._*


```solidity
function toUint144(uint256 value) internal pure returns (uint144);
```

### toUint136

*Returns the downcasted uint136 from uint256, reverting on
overflow (when the input is greater than largest uint136).
Counterpart to Solidity's `uint136` operator.
Requirements:
- input must fit into 136 bits
_Available since v4.7._*


```solidity
function toUint136(uint256 value) internal pure returns (uint136);
```

### toUint128

*Returns the downcasted uint128 from uint256, reverting on
overflow (when the input is greater than largest uint128).
Counterpart to Solidity's `uint128` operator.
Requirements:
- input must fit into 128 bits
_Available since v2.5._*


```solidity
function toUint128(uint256 value) internal pure returns (uint128);
```

### toUint120

*Returns the downcasted uint120 from uint256, reverting on
overflow (when the input is greater than largest uint120).
Counterpart to Solidity's `uint120` operator.
Requirements:
- input must fit into 120 bits
_Available since v4.7._*


```solidity
function toUint120(uint256 value) internal pure returns (uint120);
```

### toUint112

*Returns the downcasted uint112 from uint256, reverting on
overflow (when the input is greater than largest uint112).
Counterpart to Solidity's `uint112` operator.
Requirements:
- input must fit into 112 bits
_Available since v4.7._*


```solidity
function toUint112(uint256 value) internal pure returns (uint112);
```

### toUint104

*Returns the downcasted uint104 from uint256, reverting on
overflow (when the input is greater than largest uint104).
Counterpart to Solidity's `uint104` operator.
Requirements:
- input must fit into 104 bits
_Available since v4.7._*


```solidity
function toUint104(uint256 value) internal pure returns (uint104);
```

### toUint96

*Returns the downcasted uint96 from uint256, reverting on
overflow (when the input is greater than largest uint96).
Counterpart to Solidity's `uint96` operator.
Requirements:
- input must fit into 96 bits
_Available since v4.2._*


```solidity
function toUint96(uint256 value) internal pure returns (uint96);
```

### toUint88

*Returns the downcasted uint88 from uint256, reverting on
overflow (when the input is greater than largest uint88).
Counterpart to Solidity's `uint88` operator.
Requirements:
- input must fit into 88 bits
_Available since v4.7._*


```solidity
function toUint88(uint256 value) internal pure returns (uint88);
```

### toUint80

*Returns the downcasted uint80 from uint256, reverting on
overflow (when the input is greater than largest uint80).
Counterpart to Solidity's `uint80` operator.
Requirements:
- input must fit into 80 bits
_Available since v4.7._*


```solidity
function toUint80(uint256 value) internal pure returns (uint80);
```

### toUint72

*Returns the downcasted uint72 from uint256, reverting on
overflow (when the input is greater than largest uint72).
Counterpart to Solidity's `uint72` operator.
Requirements:
- input must fit into 72 bits
_Available since v4.7._*


```solidity
function toUint72(uint256 value) internal pure returns (uint72);
```

### toUint64

*Returns the downcasted uint64 from uint256, reverting on
overflow (when the input is greater than largest uint64).
Counterpart to Solidity's `uint64` operator.
Requirements:
- input must fit into 64 bits
_Available since v2.5._*


```solidity
function toUint64(uint256 value) internal pure returns (uint64);
```

### toUint56

*Returns the downcasted uint56 from uint256, reverting on
overflow (when the input is greater than largest uint56).
Counterpart to Solidity's `uint56` operator.
Requirements:
- input must fit into 56 bits
_Available since v4.7._*


```solidity
function toUint56(uint256 value) internal pure returns (uint56);
```

### toUint48

*Returns the downcasted uint48 from uint256, reverting on
overflow (when the input is greater than largest uint48).
Counterpart to Solidity's `uint48` operator.
Requirements:
- input must fit into 48 bits
_Available since v4.7._*


```solidity
function toUint48(uint256 value) internal pure returns (uint48);
```

### toUint40

*Returns the downcasted uint40 from uint256, reverting on
overflow (when the input is greater than largest uint40).
Counterpart to Solidity's `uint40` operator.
Requirements:
- input must fit into 40 bits
_Available since v4.7._*


```solidity
function toUint40(uint256 value) internal pure returns (uint40);
```

### toUint32

*Returns the downcasted uint32 from uint256, reverting on
overflow (when the input is greater than largest uint32).
Counterpart to Solidity's `uint32` operator.
Requirements:
- input must fit into 32 bits
_Available since v2.5._*


```solidity
function toUint32(uint256 value) internal pure returns (uint32);
```

### toUint24

*Returns the downcasted uint24 from uint256, reverting on
overflow (when the input is greater than largest uint24).
Counterpart to Solidity's `uint24` operator.
Requirements:
- input must fit into 24 bits
_Available since v4.7._*


```solidity
function toUint24(uint256 value) internal pure returns (uint24);
```

### toUint16

*Returns the downcasted uint16 from uint256, reverting on
overflow (when the input is greater than largest uint16).
Counterpart to Solidity's `uint16` operator.
Requirements:
- input must fit into 16 bits
_Available since v2.5._*


```solidity
function toUint16(uint256 value) internal pure returns (uint16);
```

### toUint8

*Returns the downcasted uint8 from uint256, reverting on
overflow (when the input is greater than largest uint8).
Counterpart to Solidity's `uint8` operator.
Requirements:
- input must fit into 8 bits
_Available since v2.5._*


```solidity
function toUint8(uint256 value) internal pure returns (uint8);
```

### toUint256

*Converts a signed int256 into an unsigned uint256.
Requirements:
- input must be greater than or equal to 0.
_Available since v3.0._*


```solidity
function toUint256(int256 value) internal pure returns (uint256);
```

### toInt248

*Returns the downcasted int248 from int256, reverting on
overflow (when the input is less than smallest int248 or
greater than largest int248).
Counterpart to Solidity's `int248` operator.
Requirements:
- input must fit into 248 bits
_Available since v4.7._*


```solidity
function toInt248(int256 value) internal pure returns (int248);
```

### toInt240

*Returns the downcasted int240 from int256, reverting on
overflow (when the input is less than smallest int240 or
greater than largest int240).
Counterpart to Solidity's `int240` operator.
Requirements:
- input must fit into 240 bits
_Available since v4.7._*


```solidity
function toInt240(int256 value) internal pure returns (int240);
```

### toInt232

*Returns the downcasted int232 from int256, reverting on
overflow (when the input is less than smallest int232 or
greater than largest int232).
Counterpart to Solidity's `int232` operator.
Requirements:
- input must fit into 232 bits
_Available since v4.7._*


```solidity
function toInt232(int256 value) internal pure returns (int232);
```

### toInt224

*Returns the downcasted int224 from int256, reverting on
overflow (when the input is less than smallest int224 or
greater than largest int224).
Counterpart to Solidity's `int224` operator.
Requirements:
- input must fit into 224 bits
_Available since v4.7._*


```solidity
function toInt224(int256 value) internal pure returns (int224);
```

### toInt216

*Returns the downcasted int216 from int256, reverting on
overflow (when the input is less than smallest int216 or
greater than largest int216).
Counterpart to Solidity's `int216` operator.
Requirements:
- input must fit into 216 bits
_Available since v4.7._*


```solidity
function toInt216(int256 value) internal pure returns (int216);
```

### toInt208

*Returns the downcasted int208 from int256, reverting on
overflow (when the input is less than smallest int208 or
greater than largest int208).
Counterpart to Solidity's `int208` operator.
Requirements:
- input must fit into 208 bits
_Available since v4.7._*


```solidity
function toInt208(int256 value) internal pure returns (int208);
```

### toInt200

*Returns the downcasted int200 from int256, reverting on
overflow (when the input is less than smallest int200 or
greater than largest int200).
Counterpart to Solidity's `int200` operator.
Requirements:
- input must fit into 200 bits
_Available since v4.7._*


```solidity
function toInt200(int256 value) internal pure returns (int200);
```

### toInt192

*Returns the downcasted int192 from int256, reverting on
overflow (when the input is less than smallest int192 or
greater than largest int192).
Counterpart to Solidity's `int192` operator.
Requirements:
- input must fit into 192 bits
_Available since v4.7._*


```solidity
function toInt192(int256 value) internal pure returns (int192);
```

### toInt184

*Returns the downcasted int184 from int256, reverting on
overflow (when the input is less than smallest int184 or
greater than largest int184).
Counterpart to Solidity's `int184` operator.
Requirements:
- input must fit into 184 bits
_Available since v4.7._*


```solidity
function toInt184(int256 value) internal pure returns (int184);
```

### toInt176

*Returns the downcasted int176 from int256, reverting on
overflow (when the input is less than smallest int176 or
greater than largest int176).
Counterpart to Solidity's `int176` operator.
Requirements:
- input must fit into 176 bits
_Available since v4.7._*


```solidity
function toInt176(int256 value) internal pure returns (int176);
```

### toInt168

*Returns the downcasted int168 from int256, reverting on
overflow (when the input is less than smallest int168 or
greater than largest int168).
Counterpart to Solidity's `int168` operator.
Requirements:
- input must fit into 168 bits
_Available since v4.7._*


```solidity
function toInt168(int256 value) internal pure returns (int168);
```

### toInt160

*Returns the downcasted int160 from int256, reverting on
overflow (when the input is less than smallest int160 or
greater than largest int160).
Counterpart to Solidity's `int160` operator.
Requirements:
- input must fit into 160 bits
_Available since v4.7._*


```solidity
function toInt160(int256 value) internal pure returns (int160);
```

### toInt152

*Returns the downcasted int152 from int256, reverting on
overflow (when the input is less than smallest int152 or
greater than largest int152).
Counterpart to Solidity's `int152` operator.
Requirements:
- input must fit into 152 bits
_Available since v4.7._*


```solidity
function toInt152(int256 value) internal pure returns (int152);
```

### toInt144

*Returns the downcasted int144 from int256, reverting on
overflow (when the input is less than smallest int144 or
greater than largest int144).
Counterpart to Solidity's `int144` operator.
Requirements:
- input must fit into 144 bits
_Available since v4.7._*


```solidity
function toInt144(int256 value) internal pure returns (int144);
```

### toInt136

*Returns the downcasted int136 from int256, reverting on
overflow (when the input is less than smallest int136 or
greater than largest int136).
Counterpart to Solidity's `int136` operator.
Requirements:
- input must fit into 136 bits
_Available since v4.7._*


```solidity
function toInt136(int256 value) internal pure returns (int136);
```

### toInt128

*Returns the downcasted int128 from int256, reverting on
overflow (when the input is less than smallest int128 or
greater than largest int128).
Counterpart to Solidity's `int128` operator.
Requirements:
- input must fit into 128 bits
_Available since v3.1._*


```solidity
function toInt128(int256 value) internal pure returns (int128);
```

### toInt120

*Returns the downcasted int120 from int256, reverting on
overflow (when the input is less than smallest int120 or
greater than largest int120).
Counterpart to Solidity's `int120` operator.
Requirements:
- input must fit into 120 bits
_Available since v4.7._*


```solidity
function toInt120(int256 value) internal pure returns (int120);
```

### toInt112

*Returns the downcasted int112 from int256, reverting on
overflow (when the input is less than smallest int112 or
greater than largest int112).
Counterpart to Solidity's `int112` operator.
Requirements:
- input must fit into 112 bits
_Available since v4.7._*


```solidity
function toInt112(int256 value) internal pure returns (int112);
```

### toInt104

*Returns the downcasted int104 from int256, reverting on
overflow (when the input is less than smallest int104 or
greater than largest int104).
Counterpart to Solidity's `int104` operator.
Requirements:
- input must fit into 104 bits
_Available since v4.7._*


```solidity
function toInt104(int256 value) internal pure returns (int104);
```

### toInt96

*Returns the downcasted int96 from int256, reverting on
overflow (when the input is less than smallest int96 or
greater than largest int96).
Counterpart to Solidity's `int96` operator.
Requirements:
- input must fit into 96 bits
_Available since v4.7._*


```solidity
function toInt96(int256 value) internal pure returns (int96);
```

### toInt88

*Returns the downcasted int88 from int256, reverting on
overflow (when the input is less than smallest int88 or
greater than largest int88).
Counterpart to Solidity's `int88` operator.
Requirements:
- input must fit into 88 bits
_Available since v4.7._*


```solidity
function toInt88(int256 value) internal pure returns (int88);
```

### toInt80

*Returns the downcasted int80 from int256, reverting on
overflow (when the input is less than smallest int80 or
greater than largest int80).
Counterpart to Solidity's `int80` operator.
Requirements:
- input must fit into 80 bits
_Available since v4.7._*


```solidity
function toInt80(int256 value) internal pure returns (int80);
```

### toInt72

*Returns the downcasted int72 from int256, reverting on
overflow (when the input is less than smallest int72 or
greater than largest int72).
Counterpart to Solidity's `int72` operator.
Requirements:
- input must fit into 72 bits
_Available since v4.7._*


```solidity
function toInt72(int256 value) internal pure returns (int72);
```

### toInt64

*Returns the downcasted int64 from int256, reverting on
overflow (when the input is less than smallest int64 or
greater than largest int64).
Counterpart to Solidity's `int64` operator.
Requirements:
- input must fit into 64 bits
_Available since v3.1._*


```solidity
function toInt64(int256 value) internal pure returns (int64);
```

### toInt56

*Returns the downcasted int56 from int256, reverting on
overflow (when the input is less than smallest int56 or
greater than largest int56).
Counterpart to Solidity's `int56` operator.
Requirements:
- input must fit into 56 bits
_Available since v4.7._*


```solidity
function toInt56(int256 value) internal pure returns (int56);
```

### toInt48

*Returns the downcasted int48 from int256, reverting on
overflow (when the input is less than smallest int48 or
greater than largest int48).
Counterpart to Solidity's `int48` operator.
Requirements:
- input must fit into 48 bits
_Available since v4.7._*


```solidity
function toInt48(int256 value) internal pure returns (int48);
```

### toInt40

*Returns the downcasted int40 from int256, reverting on
overflow (when the input is less than smallest int40 or
greater than largest int40).
Counterpart to Solidity's `int40` operator.
Requirements:
- input must fit into 40 bits
_Available since v4.7._*


```solidity
function toInt40(int256 value) internal pure returns (int40);
```

### toInt32

*Returns the downcasted int32 from int256, reverting on
overflow (when the input is less than smallest int32 or
greater than largest int32).
Counterpart to Solidity's `int32` operator.
Requirements:
- input must fit into 32 bits
_Available since v3.1._*


```solidity
function toInt32(int256 value) internal pure returns (int32);
```

### toInt24

*Returns the downcasted int24 from int256, reverting on
overflow (when the input is less than smallest int24 or
greater than largest int24).
Counterpart to Solidity's `int24` operator.
Requirements:
- input must fit into 24 bits
_Available since v4.7._*


```solidity
function toInt24(int256 value) internal pure returns (int24);
```

### toInt16

*Returns the downcasted int16 from int256, reverting on
overflow (when the input is less than smallest int16 or
greater than largest int16).
Counterpart to Solidity's `int16` operator.
Requirements:
- input must fit into 16 bits
_Available since v3.1._*


```solidity
function toInt16(int256 value) internal pure returns (int16);
```

### toInt8

*Returns the downcasted int8 from int256, reverting on
overflow (when the input is less than smallest int8 or
greater than largest int8).
Counterpart to Solidity's `int8` operator.
Requirements:
- input must fit into 8 bits
_Available since v3.1._*


```solidity
function toInt8(int256 value) internal pure returns (int8);
```

### toInt256

*Converts an unsigned uint256 into a signed int256.
Requirements:
- input must be less than or equal to maxInt256.
_Available since v3.0._*


```solidity
function toInt256(uint256 value) internal pure returns (int256);
```

