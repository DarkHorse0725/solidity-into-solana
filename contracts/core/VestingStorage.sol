// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "../interfaces/IERC20withDec.sol";

contract VestingStorage {
    struct VestingAmountInfo {
        uint totalAmount; // total amount will be claimed by investor
        uint claimedAmount; // claimed amount
    }

    /// @notice Percentage denominator
    uint16 public constant PERCENTAGE_DENOMINATOR = 10000;

    /// @notice Address of IDO token
    IERC20withDec public IDOToken;

    /// @notice Time for user to redeem IDO token
    uint64 public TGEDate;

    /// @notice Initial Time for user to redeem IDO token
    uint64 public initialTGEDate;

    /// @notice Percentage of IDO token amount of user, which can be redeemed after TGEDate
    uint16 public TGEPercentage;

    /// @notice Vesting cliff
    uint64 public vestingCliff;

    /// @notice Vesting frequency
    uint64 public vestingFrequency;

    /// @notice Number of vesting release
    uint public numberOfVestingRelease;

    /// @notice Total funded amount
    uint public totalFundedAmount;

    /// @notice vesting info of each user
    mapping(address => VestingAmountInfo) public vestingAmountInfo;

    /// @notice True if collaborator fund enough IDO token
    bool public funded;

    /// @notice True if admin allow user to claim
    bool public claimable;

    /// @dev True if emergency cancelled
    bool public emergencyCancelled;

    /// @dev True if private raise
    bool public privateRaise;
}
