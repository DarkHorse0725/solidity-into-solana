# BasePausable
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/core/BasePausable.sol)

**Inherits:**
[AccessControl](/contracts/utils/AccessControl.sol/abstract.AccessControl.md), [Pausable](/contracts/utils/Pausable.sol/abstract.Pausable.md), [Initializable](/contracts/utils/Initializable.sol/abstract.Initializable.md), [ReentrancyGuard](/contracts/utils/ReentrancyGuard.sol/abstract.ReentrancyGuard.md)


## State Variables
### OWNER_ROLE
keccak256("OWNER_ROLE")


```solidity
bytes32 public constant OWNER_ROLE = 0xb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e;
```


## Functions
### onlyOwner


```solidity
modifier onlyOwner();
```

### __BasePausable__init


```solidity
function __BasePausable__init(address owner) public onlyInitializing;
```

### isOwner


```solidity
function isOwner(address sender) public view returns (bool);
```

