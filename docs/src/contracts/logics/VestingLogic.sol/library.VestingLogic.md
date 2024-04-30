# VestingLogic
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/logics/VestingLogic.sol)


## State Variables
### PERCENTAGE_DENOMINATOR
*Percentage denominator*


```solidity
uint16 public constant PERCENTAGE_DENOMINATOR = 10000;
```


## Functions
### calculateClaimableAmount


```solidity
function calculateClaimableAmount(
    uint256 totalAmount,
    uint256 claimedAmount,
    uint16 TGEPercentage,
    uint64 TGEDate,
    uint64 vestingCliff,
    uint64 vestingFrequency,
    uint256 numberOfVestingRelease
) external view returns (uint256);
```

### verifyVestingInfo


```solidity
function verifyVestingInfo(uint256 _TGEPercentage) external pure;
```

