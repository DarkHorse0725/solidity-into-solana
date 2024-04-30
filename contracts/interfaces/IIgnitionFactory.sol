// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "../interfaces/IVesting.sol";

interface IIgnitionFactory {
    function isOwner(address sender) external view returns (bool);

    function createVesting() external returns (address);

    function getLockupDuration() external pure returns (uint);

    function getMaxGalaxyParticipationFeePercentage() external pure returns (uint16);

    function getMinGalaxyParticipationFeePercentage() external pure returns (uint16);

    function getMaxCrowdfundingParticipationFeePercentage() external pure returns (uint16);

    function getMinCrowdfundingParticipationFeePercentage() external pure returns (uint16);

    function getMaximumTGEDateAdjustment() external pure returns (uint);
    
    function getMaximumTGEDateAdjustmentAttempts() external pure returns (uint);
}
