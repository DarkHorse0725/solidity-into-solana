# BasicToken
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDT_ETH.sol)

**Inherits:**
[Ownable](/contracts/test/USDT_BSC.sol/contract.Ownable.md), [ERC20Basic](/contracts/test/USDT_ETH.sol/contract.ERC20Basic.md)

*Basic version of StandardToken, with no allowances.*


## State Variables
### balances

```solidity
mapping(address => uint256) public balances;
```


### basisPointsRate

```solidity
uint256 public basisPointsRate = 0;
```


### maximumFee

```solidity
uint256 public maximumFee = 0;
```


## Functions
### onlyPayloadSize

*Fix for the ERC20 short address attack.*


```solidity
modifier onlyPayloadSize(uint256 size);
```

### transfer

*transfer token for a specified address*


```solidity
function transfer(address _to, uint256 _value) public onlyPayloadSize(2 * 32);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The address to transfer to.|
|`_value`|`uint256`|The amount to be transferred.|


### balanceOf

*Gets the balance of the specified address.*


```solidity
function balanceOf(address _owner) public view returns (uint256 balance);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address to query the the balance of.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`balance`|`uint256`|An uint representing the amount owned by the passed address.|


