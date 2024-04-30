# FiatTokenV1
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDC_ETH.sol)

**Inherits:**
[AbstractFiatTokenV1](/contracts/test/USDC_ETH.sol/abstract.AbstractFiatTokenV1.md), [Ownable](/contracts/test/USDT_BSC.sol/contract.Ownable.md), [Pausable](/contracts/utils/Pausable.sol/abstract.Pausable.md)

Copyright (c) 2018-2020 CENTRE SECZ
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*Allows accounts to be blacklisted by a "blacklister" role
Copyright (c) 2018-2020 CENTRE SECZ
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*

*ERC20 Token backed by fiat reserves*


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
uint8 public decimals;
```


### currency

```solidity
string public currency;
```


### masterMinter

```solidity
address public masterMinter;
```


### initialized

```solidity
bool internal initialized;
```


### balances

```solidity
mapping(address => uint256) internal balances;
```


### allowed

```solidity
mapping(address => mapping(address => uint256)) internal allowed;
```


### totalSupply_

```solidity
uint256 internal totalSupply_ = 0;
```


### minters

```solidity
mapping(address => bool) internal minters;
```


### minterAllowed

```solidity
mapping(address => uint256) internal minterAllowed;
```


## Functions
### initialize


```solidity
function initialize(
    string memory tokenName,
    string memory tokenSymbol,
    string memory tokenCurrency,
    uint8 tokenDecimals,
    address newMasterMinter,
    address newPauser,
    address newBlacklister,
    address newOwner
) public;
```

### onlyMinters

*Throws if called by any account other than a minter*


```solidity
modifier onlyMinters();
```

### mint

*Function to mint tokens*


```solidity
function mint(address _to, uint256 _amount) external whenNotPaused onlyMinters returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The address that will receive the minted tokens.|
|`_amount`|`uint256`|The amount of tokens to mint. Must be less than or equal to the minterAllowance of the caller.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|A boolean that indicates if the operation was successful.|


### onlyMasterMinter

*Throws if called by any account other than the masterMinter*


```solidity
modifier onlyMasterMinter();
```

### minterAllowance

*Get minter allowance for an account*


```solidity
function minterAllowance(address minter) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`minter`|`address`|The address of the minter|


### isMinter

*Checks if account is a minter*


```solidity
function isMinter(address account) external view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`account`|`address`|The address to check|


### allowance

Amount of remaining tokens spender is allowed to transfer on
behalf of the token owner


```solidity
function allowance(address owner, address spender) external view override returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`owner`|`address`|    Token owner's address|
|`spender`|`address`|  Spender's address|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|Allowance amount|


### totalSupply

*Get totalSupply of token*


```solidity
function totalSupply() external view override returns (uint256);
```

### balanceOf

*Get token balance of an account*


```solidity
function balanceOf(address account) external view override returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`account`|`address`|address The account|


### approve

Set spender's allowance over the caller's tokens to be a given
value.


```solidity
function approve(address spender, uint256 value) external override whenNotPaused returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`spender`|`address`|  Spender's address|
|`value`|`uint256`|    Allowance amount|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if successful|


### _approve

*Internal function to set allowance*


```solidity
function _approve(address owner, address spender, uint256 value) internal override;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`owner`|`address`|    Token owner's address|
|`spender`|`address`|  Spender's address|
|`value`|`uint256`|    Allowance amount|


### transferFrom

Transfer tokens by spending allowance


```solidity
function transferFrom(address from, address to, uint256 value) external override whenNotPaused returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`from`|`address`| Payer's address|
|`to`|`address`|   Payee's address|
|`value`|`uint256`|Transfer amount|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if successful|


### transfer

Transfer tokens from the caller


```solidity
function transfer(address to, uint256 value) external override whenNotPaused returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`to`|`address`|   Payee's address|
|`value`|`uint256`|Transfer amount|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if successful|


### _transfer

Internal function to process transfers


```solidity
function _transfer(address from, address to, uint256 value) internal override;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`from`|`address`| Payer's address|
|`to`|`address`|   Payee's address|
|`value`|`uint256`|Transfer amount|


### configureMinter

*Function to add/update a new minter*


```solidity
function configureMinter(address minter, uint256 minterAllowedAmount)
    external
    whenNotPaused
    onlyMasterMinter
    returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`minter`|`address`|The address of the minter|
|`minterAllowedAmount`|`uint256`|The minting amount allowed for the minter|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the operation was successful.|


### removeMinter

*Function to remove a minter*


```solidity
function removeMinter(address minter) external onlyMasterMinter returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`minter`|`address`|The address of the minter to remove|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the operation was successful.|


### burn

*allows a minter to burn some of its own tokens
Validates that caller is a minter and that sender is not blacklisted
amount is less than or equal to the minter's account balance*


```solidity
function burn(uint256 _amount) external whenNotPaused onlyMinters;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_amount`|`uint256`|uint256 the amount of tokens to be burned|


### updateMasterMinter


```solidity
function updateMasterMinter(address _newMasterMinter) external onlyOwner;
```

## Events
### Mint

```solidity
event Mint(address indexed minter, address indexed to, uint256 amount);
```

### Burn

```solidity
event Burn(address indexed burner, uint256 amount);
```

### MinterConfigured

```solidity
event MinterConfigured(address indexed minter, uint256 minterAllowedAmount);
```

### MinterRemoved

```solidity
event MinterRemoved(address indexed oldMinter);
```

### MasterMinterChanged

```solidity
event MasterMinterChanged(address indexed newMasterMinter);
```

