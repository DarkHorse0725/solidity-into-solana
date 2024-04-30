// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/proxy/Clones.sol";

import "./Base.sol";
import "../interfaces/IPool.sol";
import "../interfaces/IIgnitionFactory.sol";
import "../interfaces/IVesting.sol";
import "../interfaces/IIgnitionFactory.sol";

/**
 * @title Ignition Factory Contract
 * @notice
 * - Main contracts: IgnitionFactory, Pool, Vesting.
 - IgnitionFactory: This contract will be used to deploy a pair Pool + Vesting contract for collaborator.
   - Contract is upgradeable using `TransparentProxy` pattern.
   - Collaborator can create pool by calling `CreatePool` function.
 - Pool: This contract will be used as a main contract for investors, Collaborator for most IDO actions such as buy token, Claim IDO token, fund token, etc.
   - Pool Contract is using `Clone (Minimal proxy` pattern to reduce the gas fee during deployment.
 - Vesting: This contract will be used as a utility contract to separate logic vesting from Pool contract.
   - Vesting Contract is using `Clone (Minimal proxy` pattern to reduce the gas fee during deployment.
 * @author Paid
 */

   contract IgnitionFactory is Base {
    /// @dev Address of pool implementation
    address public poolImplementationAddress;

    /// @dev Address of vesting implementation
    address public vestingImplementationAddress;

    /// @dev Lockup duration after TGE Date
    uint public constant LOCKUP_DURATION = 2 days;

    /// @dev Minimum galaxy participation fee percentage for pool deployment
    uint16 public constant MINIMUM_GALAXY_PARTICIPATION_FEE_PERCENTAGE = 0;
    /// @dev Minimum crown participation fee percentage for pool deployment
    uint16 public constant MINIMUM_CROWN_FUNDING_PARTICIPATION_FEE_PERCENTAGE = 0;

    /// @dev Maximum galaxy participation fee percentage for pool deployment
    uint16 public constant MAXIMUM_GALAXY_PARTICIPATION_FEE_PERCENTAGE = 5000;
    /// @dev Minumum crown participation fee percentage for pool deployment
    uint16 public constant MAXIMUM_CROWN_FUNDING_PARTICIPATION_FEE_PERCENTAGE = 5000;

    /// @dev Maximum TGE Date adjustment when it comes to TGE Update
    uint public constant MAXIMUM_TGE_DATE_ADJUSTMENT = 730 days;

     /// @dev Maximum TGE Date adjustment attemps when it comes to TGE Update
    uint public constant MAXIMUM_TGE_DATE_ADJUSTMENT_ATTEMPS = 2;

    // ============================== EVENT ==============================

    event UpdatePoolImplementation(
        address indexed oldPoolImplementation,
        address indexed newPoolImplementation
    );

    event UpdateVestingImplementation(
        address indexed oldVestingImplementation,
        address indexed newVestingImplementation
    );

    event PoolCreated(bytes32 poolInfoHash, address pool);

    event VestingCreated(address sender, address vesting);

    // ============================== EXTERNAL FUNCTION ==============================

    /**
     * @notice Initialize pool factory with address of pool implementation
     * @dev Called only once
     * @param _poolImplementationAddress Address of pool implementation
     */
    function initialize(
        address _poolImplementationAddress,
        address _vestingImplementationAddress
    ) external initializer {
        poolImplementationAddress = _poolImplementationAddress;
        vestingImplementationAddress = _vestingImplementationAddress;
        __Base__init(_msgSender());
    }

    /**
     * @notice Set or change address of pool implementation
     * @dev Only admin can can call it
     * @param _poolImplementationAddress Address of new pool implementation
     */
    function setPoolImplementation(
        address _poolImplementationAddress
    ) external onlyOwner {
        _validAddress(_poolImplementationAddress);
        address oldPoolImplementation = poolImplementationAddress;
        poolImplementationAddress = _poolImplementationAddress;
        emit UpdatePoolImplementation(
            oldPoolImplementation,
            _poolImplementationAddress
        );
    }

    /**
     * @notice Set or change address of vesting implementation
     * @dev Only admin can can call it
     * @param _vestingImplementationAddress Address of new vesting implementation
     */
    function setVestingImplementation(
        address _vestingImplementationAddress
    ) external onlyOwner {
        _validAddress(_vestingImplementationAddress);
        address oldVestingImplementation = vestingImplementationAddress;
        vestingImplementationAddress = _vestingImplementationAddress;
        emit UpdateVestingImplementation(
            oldVestingImplementation,
            _vestingImplementationAddress
        );
    }

    /**
     * @notice Create new pool. One pool has 2 sub-pool: galaxy pool and crowfunding pool, with 2 different participation fee.
     * In crowfunding pool, there is a part for WHALE to buy early (called EARLY ACCESS) and another for NORMAL user to buy
     * (called NORMAL ACCESS). Duration of galaxy pool and EARLY ACCESS are same and before duration of NORMAL ACCESS.
     *
     * There are 3 types of fund: PARTICIPATION FEE, TOKEN FEE and COLLABORATOR FUND.
     * Investors need to pay PURCHASE AMOUNT and PARTICIPATION FEE
     * PURCHASE AMOUNT (purchase token) = TOKEN FEE + COLLABORATOR FUND = total raise amount (IDO token) * price
     *
     * Sale End -> TGE Date -> 14 days -> Lockup
     * 14 days is a config variable in the system (constant)
     *
     * If project is success (not be cancelled by admin or funded enough IDO token or not emergency canceled in lockup duration),
     *  - System's admin claims participation fee and token fee after lockup time
     *    (call pool.claimParticipationFee(), pool.claimTokenFee())
     *  - Collaborator claims collaborator fund (purchased amount - token fee) based on vesting rule after lockup time (vesting schedule start from TGE date)
     *    (call pool.claimFund())
     *  - Investors claim IDO token based on vesting rule after TGE date
     *    (call vesting.claim())
     *  - Collaborator withdraws redundant IDO token after TGE date
     *    (call pool.withdrawRedundantIDOToken())
     *
     * If project is fail before TGE Date (cancelled by admin or not be funded enough IDO token) (of course before TGE date)
     *  - Investors withdraw purchased amount and participation fee after cancelled time or TGE date
     *    (call pool.withdrawPurchasedAmountAndParticipationFee())
     *  - Collaborator withdraws funded IDO token after cancelled time or TGE date
     *    (call pool.withdrawRedundantIDOToken())
     *
     * If project is fail after TGE Date and before Lockup time
     *  - Investors claim IDO token based on vesting rule after TGE date and before cancelled time
     *    (call vesting.claim())
     *  - Investors withdraw purchased amount and participation fee at cancelled time
     *    (call pool.withdrawPurchasedAmount())
     *  - Collaborator withdraws redundant IDO token after TGE date and before cancelled time
     *    (call pool.withdrawRedundantIDOToken())
     *  - All remaining IDO will be locked in contract.
     *
     * @dev Only has one pool address respectively for one input params
     * @param addrs Array of address includes:
     * - address of IDO token,
     * - address of purchase token
     * @param uints Array of pool information includes:
     * - max purchase amount for KYC user,
     * - max purchase amount for Not KYC user,
     * - token project fee percentage, // will be sent to admin if success or investor in vice versa
     * - galaxy participation fee percentage, // will be sent to admin
     * - crowdfunding participation fee percentage, // will be sent to admin
     * - galaxy pool proportion, (ratio with all project)
     * - early access proportion, (ratio with only crowdfunding pool)
     * - total raise amount,
     * - whale open time,
     * - whale duration,
     * - community duration,
     * - rate of IDO token (based on formula in README),
     * - decimal of IDO token (based on formula in README, is different from decimals in contract of IDO token),
     * - TGE date,
     * - TGE percentage,
     * - vesting cliff,
     * - vesting frequency,
     * - number of vesting release
     * @param dbProjectId Project Id in database
     * @return pool Address of new pool
     */
    function createPool(
        address[2] memory addrs,
        uint[18] memory uints,
        uint dbProjectId
    ) external returns (address pool) {
        bytes32 salt = keccak256(
            abi.encode(addrs, uints, _msgSender(), dbProjectId)
        );

        pool = Clones.cloneDeterministic(poolImplementationAddress, salt);
        IPool(pool).initialize(addrs, uints, _msgSender());

        bytes32 poolInfoHash = keccak256(abi.encode(addrs, uints, dbProjectId));

        emit PoolCreated(poolInfoHash, pool);

        return pool;
    }

    /// @notice create Vesting Proxy(clones) contract using Clone pattern
    function createVesting() external returns (address) {
        address vesting = Clones.clone(vestingImplementationAddress);
        emit VestingCreated(_msgSender(), vesting);
        return vesting;
    }

    // ============================== PUBLIC FUNCTION ==============================

    function getLockupDuration() public pure returns (uint) {
        return LOCKUP_DURATION;
    }

    function getMaxGalaxyParticipationFeePercentage() public pure returns (uint16) {
        return MAXIMUM_GALAXY_PARTICIPATION_FEE_PERCENTAGE;
    }

    function getMinGalaxyParticipationFeePercentage() public pure returns (uint16) {
        return MINIMUM_GALAXY_PARTICIPATION_FEE_PERCENTAGE;
    }

    function getMaxCrowdfundingParticipationFeePercentage() public pure returns (uint16) {
        return MAXIMUM_CROWN_FUNDING_PARTICIPATION_FEE_PERCENTAGE;
    }

    function getMinCrowdfundingParticipationFeePercentage() public pure returns (uint16) {
        return MINIMUM_CROWN_FUNDING_PARTICIPATION_FEE_PERCENTAGE;
    }

    function getMaximumTGEDateAdjustment() public pure returns (uint) {
        return MAXIMUM_TGE_DATE_ADJUSTMENT;
    }

     function getMaximumTGEDateAdjustmentAttempts() public pure returns (uint) {
        return MAXIMUM_TGE_DATE_ADJUSTMENT_ATTEMPS;
    }

    // ============================== INTERNAL FUNCTION ==============================

    /**
     * @dev Check whether or not an address is zero address
     * @param _address An address
     */
    function _validAddress(address _address) internal pure {
        if (_address == address(0)) {
            revert Errors.ZeroAddressNotValid();
        }
    }
}
