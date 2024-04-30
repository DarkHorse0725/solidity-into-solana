# Initializable
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDC_BSC.sol)

*This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
behind a proxy. Since a proxied contract can't have a constructor, it's common to move constructor logic to an
external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
possible by providing the encoded function call as the `_data` argument to {UpgradeableProxy-constructor}.
CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.*


## State Variables
### _initialized
*Indicates that the contract has been initialized.*


```solidity
bool private _initialized;
```


### _initializing
*Indicates that the contract is in the process of being initialized.*


```solidity
bool private _initializing;
```


## Functions
### initializer

*Modifier to protect an initializer function from being invoked twice.*


```solidity
modifier initializer();
```

### _isConstructor

*Returns true if and only if the function is running in the constructor*


```solidity
function _isConstructor() private view returns (bool);
```

