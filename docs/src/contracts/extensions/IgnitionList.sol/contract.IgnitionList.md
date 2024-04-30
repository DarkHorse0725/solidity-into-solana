# IgnitionList
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/extensions/IgnitionList.sol)


## State Variables
### root

```solidity
bytes32 public root;
```


## Functions
### _verifyUser


```solidity
function _verifyUser(
    address _candidate,
    bytes32 _userType,
    uint256 _maxPurchaseWhetherOrNotKYCAmount,
    uint256 _maxPurchaseBaseOnAllocations,
    bytes32[] memory proof
) internal view returns (bool);
```

