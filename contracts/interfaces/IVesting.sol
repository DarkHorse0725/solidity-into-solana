// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "../interfaces/IERC20withDec.sol";

interface IVesting {
    function initialize(
        address owner,
        address _IDOToken,
        uint _TGEDate,
        uint _TGEPercentage,
        uint _vestingCliff,
        uint _vestingFrequency,
        uint _numberOfVestingRelease
    ) external;

    function createVestingSchedule(address _user, uint _totalAmount) external;

    function setIDOToken(IERC20withDec _IDOToken) external;

    function getTotalFundedAmount() external view returns (uint256);

    function getIDOToken() external view returns (IERC20withDec);

    function setFundedStatus(uint256 amount, bool _status) external;

    function setClaimableStatus(bool _status) external;

    function isClaimable() external view returns (bool);

    function getInitialTGEDate()
        external
        view
        returns (uint64);

    function getVestingInfo()
        external
        view
        returns (uint64, uint16, uint64, uint64, uint);

    function getVestingInfoForAddress(address _address) external view returns (uint, uint);

    function updateTGEDate(uint64 _newTGEDate) external;

    function isFunded() external view returns (bool);

    function isPrivateRaise() external view returns (bool);

    function withdrawRedundantIDOToken(
        address _beneficiary,
        uint _redundantAmount
    ) external;

    function isEmergencyCancelled() external view returns (bool);

    function setEmergencyCancelled(bool _status) external;
}
