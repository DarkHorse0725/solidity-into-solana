// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

import "./Base.sol";
import "../interfaces/IVesting.sol";
import "./VestingStorage.sol";
import "../logics/VestingLogic.sol";

/**
 * @title Vesting Contract
 * @notice Vesting contract helps the investor to create vesting schedule for all investors to prevent token dumping after project launched
 * @dev Owner of this contract is the corresponding Pool contract. So there'll be no interaction between EOA and this contract
 * @author Paid
 */
contract Vesting is IVesting, VestingStorage, Base {
    using SafeERC20 for IERC20withDec;

    // ============================== EVENT ==============================

    event SetClaimableStatus(bool status);

    event UpdateTGEDate(uint64 newTGEDate);

    event SetIDOTokenAddress(address IDOToken);

    event SetEmergencyCancelled(bool status);

    event Funded(bool status);

    event WithdrawRedundantIDOToken(address beneficiary, uint redundantAmount);

    event ClaimIDOToken(
        address sender,
        address beneficiary,
        uint claimableAmount
    );

    // ============================== MODIFIER ==============================
    modifier afterTGEDate() {
        if (block.timestamp < TGEDate) {
            revert Errors.NotAllowedToTransferBBeforeTGEDate();
        }
        _;
    }

    modifier onlySatisfyClaimCondition() {
        if (!isFunded() || !isClaimable()) {
            revert Errors.NotAllowedToClaimIDOToken();
        }
        _;
    }

    modifier notEmergencyCancelled() {
        if (emergencyCancelled) {
            revert Errors.NotAllowedToDoAfterEmergencyCancelled();
        }
        _;
    }

    // ============================== EXTERNAL FUNCTION ==============================

    /**
     * @notice Initialize a vesting with its information
     * @dev Initialize should only be called by Pool contract during deployment only.
     * @param owner Owner of vesting contract (which is pool contract)
     * @param _IDOToken Pool IDO Token address
     * @param _TGEDate TGE Date (Date to start to claim IDO token)
     * @param _TGEPercentage TGE vesting percentage (amount that investor can claim immediately)
     * @param _vestingCliff Cliff duration
     * @param _vestingFrequency Vesting frequency for investor to claim. Ex: 1 days - 1 month
     * @param _numberOfVestingRelease Number of vesting periods. Ex: 12 with vestingFrequency = 1 month -> vesting duration = 1 year
     */
    function initialize(
        address owner,
        address _IDOToken,
        uint _TGEDate,
        uint _TGEPercentage,
        uint _vestingCliff,
        uint _vestingFrequency,
        uint _numberOfVestingRelease
    ) external override initializer {
        VestingLogic.verifyVestingInfo(_TGEPercentage);
        IDOToken = IERC20withDec(_IDOToken);
        initialTGEDate = SafeCast.toUint64(_TGEDate);
        TGEDate = initialTGEDate;
        TGEPercentage = SafeCast.toUint16(_TGEPercentage);
        vestingCliff = SafeCast.toUint64(_vestingCliff);
        vestingFrequency = SafeCast.toUint64(_vestingFrequency);
        numberOfVestingRelease = _numberOfVestingRelease;

        if (address(IDOToken) == address(0)) {
            privateRaise = true;
        }

        claimable = true;

        _setupRole(OWNER_ROLE, owner);
        _setRoleAdmin(OWNER_ROLE, OWNER_ROLE);
    }

    /**
     * @notice Initialize/Update Vesting Schedule for an investor
     * @dev Called by the pool contract to update investor vesting details when user purchased IDO Token
     * @param _user Investor address
     * @param _totalAmount Total purchased IDO token
     */
    function createVestingSchedule(
        address _user,
        uint _totalAmount
    ) external onlyOwner {
        if (_totalAmount == 0) {
            revert Errors.ZeroAmountNotValid();
        }

        vestingAmountInfo[_user].totalAmount += _totalAmount;
    }

    /**
     * @notice set IDO Token for vesting contraxt
     * @dev  Called by the pool contract to update IDO token address
     * @param _IDOToken IDO token address
     */
    function setIDOToken(IERC20withDec _IDOToken) external onlyOwner {
        IDOToken = _IDOToken;
        emit SetIDOTokenAddress(address(_IDOToken));
    }

    /**
     * @notice set pool is funded by collaborator or not
     * @dev  Called by the pool contract to update funded status
     * @param _status funded status
     */
    function setFundedStatus(uint256 fundedAmount, bool _status) external onlyOwner {
        funded = _status;
        totalFundedAmount = fundedAmount;
        emit Funded(_status);
    }

    /**
     * @notice set pool claimable status
     */
    function setClaimableStatus(bool _status) external onlyOwner {
        claimable = _status;
        emit SetClaimableStatus(_status);
    }

    /**
     * @notice set pool claimable status
     */
    function setEmergencyCancelled(bool _status) external onlyOwner {
        emergencyCancelled = _status;
        emit SetEmergencyCancelled(_status);
    }

    /**
     * @notice update TGE Date
    */
    function updateTGEDate(uint64 _TGEDate) external onlyOwner {
        TGEDate = _TGEDate;
        emit UpdateTGEDate(_TGEDate);
    }

    /**
     * @notice Claim all claimable IDO Token during vesting period
     * @param _beneficiary Address to receive IDO token address
     */
    function claimIDOToken(
        address _beneficiary
    ) external onlySatisfyClaimCondition nonReentrant afterTGEDate notEmergencyCancelled{
        VestingAmountInfo storage userInfo = vestingAmountInfo[_msgSender()];
        if (userInfo.claimedAmount >= userInfo.totalAmount) {
            revert Errors.AlreadyClaimTotalAmount();
        }

        uint claimableAmount = getClaimableAmount(_msgSender());
        if (claimableAmount <= 0) {
            revert Errors.InvalidClaimableAmount();
        }

        claimableAmount = claimableAmount <= IDOToken.balanceOf(address(this))
            ? claimableAmount
            : IDOToken.balanceOf(address(this));
        userInfo.claimedAmount += claimableAmount;

        IERC20withDec(IDOToken).safeTransfer(_beneficiary, claimableAmount);

        emit ClaimIDOToken(_msgSender(), _beneficiary, claimableAmount);
    }

    /**
     * @notice Withdraw all redundant IDO Token if it has been funded into vesting contract
    */
    function withdrawRedundantIDOToken(
        address _beneficiary,
        uint _redundantAmount
    ) external onlyOwner nonReentrant {
        if (_redundantAmount == 0) {
            revert Errors.ZeroAddressNotValid();
        }

        IDOToken.safeTransfer(_beneficiary, _redundantAmount);

        emit WithdrawRedundantIDOToken(_beneficiary, _redundantAmount);
    }

    function getIDOToken() external view returns (IERC20withDec) {
        return IDOToken;
    }
    function getInitialTGEDate() external view returns (uint64) {
        return initialTGEDate;
    }

    function getTotalFundedAmount() external view returns (uint256) {
        return totalFundedAmount;
    }
    function getVestingInfo()
        external
        view
        returns (uint64, uint16, uint64, uint64, uint)
    {
        return (
            TGEDate,
            TGEPercentage,
            vestingCliff,
            vestingFrequency,
            numberOfVestingRelease
        );
    }

    function getVestingInfoForAddress(address _address) external view returns (uint, uint) {
        return (vestingAmountInfo[_address].totalAmount, vestingAmountInfo[_address].claimedAmount);
    }

    // ============================== PUBLIC FUNCTION ==============================

    function isClaimable() public view returns (bool) {
        return claimable;
    }

    function isFunded() public view returns (bool) {
        return funded;
    }

    function isPrivateRaise() public view returns (bool) {
        return privateRaise;
    }

    /**
     * @notice A function that helps calculate current claimable amount for investor
     * @dev This function can be used by our FE to show up information in UI
    */
    function getClaimableAmount(address user) public view returns (uint) {
        VestingAmountInfo memory userInfo = vestingAmountInfo[user];
        return
            VestingLogic.calculateClaimableAmount(
                userInfo.totalAmount,
                userInfo.claimedAmount,
                TGEPercentage,
                TGEDate,
                vestingCliff,
                vestingFrequency,
                numberOfVestingRelease
            );
    }

    function isEmergencyCancelled() public view returns (bool) {
        return emergencyCancelled;
    }
}
