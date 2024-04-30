# BEP20TokenImplementation
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDC_BSC.sol)

**Inherits:**
[Context](/contracts/utils/Context.sol/abstract.Context.md), [IBEP20](/contracts/test/USDT_BSC.sol/interface.IBEP20.md), [Initializable](/contracts/utils/Initializable.sol/abstract.Initializable.md)


## State Variables
### _balances

```solidity
mapping(address => uint256) private _balances;
```


### _allowances

```solidity
mapping(address => mapping(address => uint256)) private _allowances;
```


### _totalSupply

```solidity
uint256 private _totalSupply;
```


### _name

```solidity
string private _name;
```


### _symbol

```solidity
string private _symbol;
```


### _decimals

```solidity
uint8 private _decimals;
```


### _owner

```solidity
address private _owner;
```


### _mintable

```solidity
bool private _mintable;
```


## Functions
### constructor


```solidity
constructor() public;
```

### onlyOwner

*Throws if called by any account other than the owner.*


```solidity
modifier onlyOwner();
```

### initialize

*sets initials supply and the owner*


```solidity
function initialize(
    string memory name,
    string memory symbol,
    uint8 decimals,
    uint256 amount,
    bool mintable,
    address owner
) public initializer;
```

### renounceOwnership

*Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions anymore. Can only be called by the current owner.
NOTE: Renouncing ownership will leave the contract without an owner,
thereby removing any functionality that is only available to the owner.*


```solidity
function renounceOwnership() public onlyOwner;
```

### transferOwnership

*Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner.*


```solidity
function transferOwnership(address newOwner) public onlyOwner;
```

### mintable

*Returns if the token is mintable or not*


```solidity
function mintable() external view returns (bool);
```

### getOwner

*Returns the bep token owner.*


```solidity
function getOwner() external view override returns (address);
```

### decimals

*Returns the token decimals.*


```solidity
function decimals() external view override returns (uint8);
```

### symbol

*Returns the token symbol.*


```solidity
function symbol() external view override returns (string memory);
```

### name

*Returns the token name.*


```solidity
function name() external view override returns (string memory);
```

### totalSupply

*See {BEP20-totalSupply}.*


```solidity
function totalSupply() external view override returns (uint256);
```

### balanceOf

*See {BEP20-balanceOf}.*


```solidity
function balanceOf(address account) external view override returns (uint256);
```

### transfer

*See {BEP20-transfer}.
Requirements:
- `recipient` cannot be the zero address.
- the caller must have a balance of at least `amount`.*


```solidity
function transfer(address recipient, uint256 amount) external override returns (bool);
```

### allowance

*See {BEP20-allowance}.*


```solidity
function allowance(address owner, address spender) external view override returns (uint256);
```

### approve

*See {BEP20-approve}.
Requirements:
- `spender` cannot be the zero address.*


```solidity
function approve(address spender, uint256 amount) external override returns (bool);
```

### transferFrom

*See {BEP20-transferFrom}.
Emits an {Approval} event indicating the updated allowance. This is not
required by the EIP. See the note at the beginning of {BEP20};
Requirements:
- `sender` and `recipient` cannot be the zero address.
- `sender` must have a balance of at least `amount`.
- the caller must have allowance for `sender`'s tokens of at least
`amount`.*


```solidity
function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool);
```

### increaseAllowance

*Atomically increases the allowance granted to `spender` by the caller.
This is an alternative to {approve} that can be used as a mitigation for
problems described in {BEP20-approve}.
Emits an {Approval} event indicating the updated allowance.
Requirements:
- `spender` cannot be the zero address.*


```solidity
function increaseAllowance(address spender, uint256 addedValue) public returns (bool);
```

### decreaseAllowance

*Atomically decreases the allowance granted to `spender` by the caller.
This is an alternative to {approve} that can be used as a mitigation for
problems described in {BEP20-approve}.
Emits an {Approval} event indicating the updated allowance.
Requirements:
- `spender` cannot be the zero address.
- `spender` must have allowance for the caller of at least
`subtractedValue`.*


```solidity
function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool);
```

### mint

*Creates `amount` tokens and assigns them to `msg.sender`, increasing
the total supply.
Requirements
- `msg.sender` must be the token owner
- `_mintable` must be true*


```solidity
function mint(uint256 amount) public onlyOwner returns (bool);
```

### burn

*Burn `amount` tokens and decreasing the total supply.*


```solidity
function burn(uint256 amount) public returns (bool);
```

### _transfer

*Moves tokens `amount` from `sender` to `recipient`.
This is internal function is equivalent to {transfer}, and can be used to
e.g. implement automatic token fees, slashing mechanisms, etc.
Emits a {Transfer} event.
Requirements:
- `sender` cannot be the zero address.
- `recipient` cannot be the zero address.
- `sender` must have a balance of at least `amount`.*


```solidity
function _transfer(address sender, address recipient, uint256 amount) internal;
```

### _mint

*Creates `amount` tokens and assigns them to `account`, increasing
the total supply.
Emits a {Transfer} event with `from` set to the zero address.
Requirements
- `to` cannot be the zero address.*


```solidity
function _mint(address account, uint256 amount) internal;
```

### _burn

*Destroys `amount` tokens from `account`, reducing the
total supply.
Emits a {Transfer} event with `to` set to the zero address.
Requirements
- `account` cannot be the zero address.
- `account` must have at least `amount` tokens.*


```solidity
function _burn(address account, uint256 amount) internal;
```

### _approve

*Sets `amount` as the allowance of `spender` over the `owner`s tokens.
This is internal function is equivalent to `approve`, and can be used to
e.g. set automatic allowances for certain subsystems, etc.
Emits an {Approval} event.
Requirements:
- `owner` cannot be the zero address.
- `spender` cannot be the zero address.*


```solidity
function _approve(address owner, address spender, uint256 amount) internal;
```

### _burnFrom

*Destroys `amount` tokens from `account`.`amount` is then deducted
from the caller's allowance.
See {_burn} and {_approve}.*


```solidity
function _burnFrom(address account, uint256 amount) internal;
```

## Events
### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
```

