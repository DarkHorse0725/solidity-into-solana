# IVesting
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/interfaces/IVesting.sol)


## Functions
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
) external;
```

### createVestingSchedule


```solidity
function createVestingSchedule(address _user, uint256 _totalAmount) external;
```

### setIDOToken


```solidity
function setIDOToken(IERC20withDec _IDOToken) external;
```

### getIDOToken


```solidity
function getIDOToken() external view returns (IERC20withDec);
```

### setFundedStatus


```solidity
function setFundedStatus(bool _status) external;
```

### setClaimableStatus


```solidity
function setClaimableStatus(bool _status) external;
```

### isClaimable


```solidity
function isClaimable() external view returns (bool);
```

### getVestingInfo


```solidity
function getVestingInfo() external view returns (uint64, uint16, uint64, uint64, uint256);
```

### updateTGEDate


```solidity
function updateTGEDate(uint64 _newTGEDate) external;
```

### isFunded


```solidity
function isFunded() external view returns (bool);
```

### withdrawRedundantIDOToken


```solidity
function withdrawRedundantIDOToken(address _beneficiary, uint256 _redundantAmount) external;
```

### isEmergencyCancelled


```solidity
function isEmergencyCancelled() external view returns (bool);
```

### setEmergencyCancelled


```solidity
function setEmergencyCancelled(bool _status) external;
```

