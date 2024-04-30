# Vesting
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/core/Vesting.sol)

**Inherits:**
[IVesting](/contracts/interfaces/IVesting.sol/interface.IVesting.md), [VestingStorage](/contracts/core/VestingStorage.sol/contract.VestingStorage.md), [BasePausable](/contracts/core/BasePausable.sol/contract.BasePausable.md)


## Functions
### afterTGEDate


```solidity
modifier afterTGEDate();
```

### onlySatisfyClaimCondition


```solidity
modifier onlySatisfyClaimCondition();
```

### notEmergencyCancelled


```solidity
modifier notEmergencyCancelled();
```

### initialize


```solidity
function initialize(
    address owner,
    address _IDOToken,
    uint256 _TGEDate,
    uint256 _TGEPercentage,
    uint256 _vestingCliff,
    uint256 _vestingFrequency,
    uint256 _numberOfVestingRelease
) external override initializer;
```

### createVestingSchedule


```solidity
function createVestingSchedule(address _user, uint256 _totalAmount) external onlyOwner;
```

### setIDOToken


```solidity
function setIDOToken(IERC20withDec _IDOToken) external onlyOwner;
```

### setFundedStatus


```solidity
function setFundedStatus(bool _status) external onlyOwner;
```

### setClaimableStatus


```solidity
function setClaimableStatus(bool _status) external onlyOwner;
```

### setEmergencyCancelled


```solidity
function setEmergencyCancelled(bool _status) external onlyOwner;
```

### updateTGEDate


```solidity
function updateTGEDate(uint64 _TGEDate) external onlyOwner;
```

### claimIDOToken


```solidity
function claimIDOToken(address _beneficiary)
    external
    onlySatisfyClaimCondition
    nonReentrant
    afterTGEDate
    notEmergencyCancelled;
```

### withdrawRedundantIDOToken


```solidity
function withdrawRedundantIDOToken(address _beneficiary, uint256 _redundantAmount)
    external
    onlyOwner
    nonReentrant
    notEmergencyCancelled;
```

### getIDOToken


```solidity
function getIDOToken() external view returns (IERC20withDec);
```

### getVestingInfo


```solidity
function getVestingInfo() external view returns (uint64, uint16, uint64, uint64, uint256);
```

### isClaimable


```solidity
function isClaimable() public view returns (bool);
```

### isFunded


```solidity
function isFunded() public view returns (bool);
```

### getClaimableAmount


```solidity
function getClaimableAmount(address user) public view returns (uint256);
```

### isEmergencyCancelled


```solidity
function isEmergencyCancelled() public view returns (bool);
```

## Events
### SetClaimableStatus

```solidity
event SetClaimableStatus(bool status);
```

### UpdateTGEDate

```solidity
event UpdateTGEDate(uint64 newTGEDate);
```

### SetIDOTokenAddress

```solidity
event SetIDOTokenAddress(address IDOToken);
```

### SetEmergencyCancelled

```solidity
event SetEmergencyCancelled(bool status);
```

### Funded

```solidity
event Funded(bool status);
```

### WithdrawRedundantIDOToken

```solidity
event WithdrawRedundantIDOToken(address beneficiary, uint256 redundantAmount);
```

### ClaimIDOToken

```solidity
event ClaimIDOToken(address sender, address beneficiary, uint256 claimableAmount);
```

