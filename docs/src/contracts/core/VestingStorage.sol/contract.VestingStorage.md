# VestingStorage
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/core/VestingStorage.sol)


## State Variables
### PERCENTAGE_DENOMINATOR
Percentage denominator


```solidity
uint16 public constant PERCENTAGE_DENOMINATOR = 10000;
```


### IDOToken
Address of IDO token


```solidity
IERC20withDec public IDOToken;
```


### TGEDate
Time for user to redeem IDO token


```solidity
uint64 public TGEDate;
```


### TGEPercentage
Percentage of IDO token amount of user, which can be redeemed after TGEDate


```solidity
uint16 public TGEPercentage;
```


### vestingCliff
Vesting cliff


```solidity
uint64 public vestingCliff;
```


### vestingFrequency
Vesting frequency


```solidity
uint64 public vestingFrequency;
```


### numberOfVestingRelease
Number of vesting release


```solidity
uint256 public numberOfVestingRelease;
```


### vestingAmountInfo
vesting info of each user


```solidity
mapping(address => VestingAmountInfo) public vestingAmountInfo;
```


### funded
True if collaborator fund enough IDO token


```solidity
bool public funded;
```


### claimable
True if admin allow user to claim


```solidity
bool public claimable = true;
```


### emergencyCancelled
*True if emergency cancelled*


```solidity
bool public emergencyCancelled;
```


## Structs
### VestingAmountInfo

```solidity
struct VestingAmountInfo {
    uint256 totalAmount;
    uint256 claimedAmount;
}
```

