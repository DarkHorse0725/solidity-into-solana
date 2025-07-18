// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {Errors} from "../helpers/Errors.sol";

library VestingLogic {
    /// @dev Percentage denominator
    uint16 public constant PERCENTAGE_DENOMINATOR = 10000;

    function calculateClaimableAmount(
        uint totalAmount,
        uint claimedAmount,
        uint16 TGEPercentage,
        uint64 TGEDate,
        uint64 vestingCliff,
        uint64 vestingFrequency,
        uint numberOfVestingRelease
    ) external view returns (uint) {
        if (claimedAmount >= totalAmount) {
            return 0;
        }
        uint TGEAmount = (totalAmount * TGEPercentage) / PERCENTAGE_DENOMINATOR;

        // In cliff time
        if (block.timestamp < TGEDate + vestingCliff) {
            return TGEAmount - claimedAmount;
        }

        // After vesting duration
        uint releaseIndex = (block.timestamp - TGEDate - vestingCliff) /
            vestingFrequency +
            1;
        if (releaseIndex >= numberOfVestingRelease || vestingFrequency == 0) {
            return totalAmount - claimedAmount;
        }

        // In vesting duration
        uint totalClaimableExceptTGEAmount = totalAmount - TGEAmount;
        return
            (releaseIndex * totalClaimableExceptTGEAmount) /
            numberOfVestingRelease +
            TGEAmount -
            claimedAmount;
    }

    function verifyVestingInfo(uint _TGEPercentage) external pure {
        if (_TGEPercentage > PERCENTAGE_DENOMINATOR) {
            revert Errors.InvalidTgePercentage();
        }
    }
}
