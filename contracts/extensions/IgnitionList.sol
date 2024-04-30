// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract IgnitionList {
    bytes32 public root;

    function _verifyUser(
        address _candidate,
        bytes32 _userType,
        uint _maxPurchaseWhetherOrNotKYCAmount,
        uint _maxPurchaseBaseOnAllocations,
        bytes32[] calldata proof
    ) internal view returns (bool) {
        // leaf = {address + hash("User type") + max purchase KYC/notKYC amount + max purchase for each user per allocation}
        bytes32 leaf = keccak256(
            abi.encodePacked(
                _candidate,
                _userType,
                _maxPurchaseWhetherOrNotKYCAmount,
                _maxPurchaseBaseOnAllocations
            )
        );
        return MerkleProof.verify(proof, root, leaf);
    }
}
