# ERC165
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/utils/ERC165.sol)

**Inherits:**
[IERC165](/contracts/interfaces/IERC165.sol/interface.IERC165.md)

*Implementation of the {IERC165} interface.
Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
for the additional interface id that will be supported. For example:
```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
}
```
Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation.*


## Functions
### supportsInterface

*See {IERC165-supportsInterface}.*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool);
```

