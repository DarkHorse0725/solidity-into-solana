// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

library TestConstants {
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    uint256 public constant SECONDS_PER_MINUTE = 60;
    uint256 public constant SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;
    uint256 public constant SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;
    uint256 public constant SECONDS_PER_WEEK = SECONDS_PER_DAY * 7;

    uint256 public constant SIX_DECIMALS = 1000000;
}
