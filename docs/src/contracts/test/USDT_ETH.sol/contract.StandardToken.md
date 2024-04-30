# StandardToken
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDT_ETH.sol)

**Inherits:**
[BasicToken](/contracts/test/USDT_ETH.sol/contract.BasicToken.md), [ERC20](/contracts/test/USDT_ETH.sol/contract.ERC20.md)

*Implementation of the basic standard token.*

*https://github.com/ethereum/EIPs/issues/20*

*Based oncode by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol*


## State Variables
### allowed

```solidity
mapping(address => mapping(address => uint256)) public allowed;
```


### MAX_UINT

```solidity
uint256 public constant MAX_UINT = 2 ** 256 - 1;
```


## Functions
### transferFrom

*Transfer tokens from one address to another*


```solidity
function transferFrom(address _from, address _to, uint256 _value) public onlyPayloadSize(3 * 32);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|address The address which you want to send tokens from|
|`_to`|`address`|address The address which you want to transfer to|
|`_value`|`uint256`|uint the amount of tokens to be transferred|


### approve

*Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.*


```solidity
function approve(address _spender, uint256 _value) public onlyPayloadSize(2 * 32);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_spender`|`address`|The address which will spend the funds.|
|`_value`|`uint256`|The amount of tokens to be spent.|


### allowance

*Function to check the amount of tokens than an owner allowed to a spender.*


```solidity
function allowance(address _owner, address _spender) public view returns (uint256 remaining);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|address The address which owns the funds.|
|`_spender`|`address`|address The address which will spend the funds.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`remaining`|`uint256`|A uint specifying the amount of tokens still available for the spender.|


