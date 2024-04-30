// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";

import "../interfaces/IPool.sol";
import "./PoolStorage.sol";
import "./VestingStorage.sol";
import "./BasePausable.sol";
import "../extensions/IgnitionList.sol";
import "../logics/PoolLogic.sol";
import "../logics/VestingLogic.sol";

contract Pool is IgnitionList, IPool, PoolStorage, BasePausable, EIP712Upgradeable {
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20withDec;
    using SafeCast for uint;

    // ============================== EVENT ==============================

    event UpdateRoot(bytes32 root);

    event CancelPool(address indexed pool, bool permanentDeleteStatus);

    event BuyToken(
        address indexed buyer,
        address indexed pool,
        uint purchaseAmount,
        uint IDOTokenAmount,
        uint8 poolType
    );

    event UpdateTime(
        uint64 whaleOpenTime,
        uint64 whaleCloseTime,
        uint64 communityOpenTime,
        uint64 communityCloseTime
    );

    event FundIDOToken(IERC20withDec IDOToken, uint fundAmount);

    event ClaimTokenFee(address beneficiary, uint tokenFee);

    event ClaimParticipationFee(
        address beneficiary,
        uint participationFeeAmount
    );

    event WithdrawPurchasedAmount(
        address sender,
        address beneficiary,
        uint principalAmount
    );

    event ClaimFund(address beneficiary, uint claimableAmount);

    // ============================== MODIFIER ==============================

    /**
     * @dev Check whether or not sender of transaction has admin role
     */
    modifier onlyAdmin() {
        if (!ignitionFactory.isOwner(_msgSender())) {
            revert Errors.CallerNotAdmin();
        }
        _;
    }

    modifier onlyFunded() {
        if (!vesting.isFunded()) {
            revert Errors.NotFunded();
        }
        _;
    }

    modifier beforeTGEDate() {
        (uint64 _TGEDate, , , , ) = vesting.getVestingInfo();
        if (block.timestamp >= _TGEDate) {
            revert Errors.NotAllowedToDoAfterTGEDate();
        }
        _;
    }

    modifier afterLockupTime() {
        (uint64 _TGEDate, , , , ) = vesting.getVestingInfo();
        if (block.timestamp < (ignitionFactory.getLockupDuration() + _TGEDate)) {
            revert Errors.NotAllowedToTransferBeforeLockupTime();
        }
        _;
    }

    modifier notEmergencyCancelled() {
        if (vesting.isEmergencyCancelled()) {
            revert Errors.NotAllowedToDoAfterEmergencyCancelled();
        }
        _;
    }

    error RedundantTokensAlreadyWithdrawn();

    constructor() {
        _disableInitializers();
    }

    // ============================== EXTERNAL FUNCTION ==============================

    /**
     * @notice Initialize a pool with its information
     * @param addrs Array of address includes:
     * - address of IDO token - Can be zero address
     * - address of purchase token
     * @param uints Array of pool information includes:
     * - max purchase amount for KYC user,
     * - max purchase amount for Not KYC user,
     * - token fee percentage,
     * - galaxy participation fee percentage,
     * - crowdfunding participation fee percentage,
     * - galaxy pool proportion,
     * - early access proportion,
     * - total raise amount,
     * - whale open time,
     * - whale duration,
     * - community duration,
     * - rate of IDO token (based on README formula),
     * - decimal of IDO token (based on README formula, is different from decimals in contract of IDO token),
     * - TGE date,
     * - TGE percentage,
     * - vesting cliff,
     * - vesting frequency,
     * - number of vesting release
     */
    function initialize(
        address[2] calldata addrs,
        uint[18] calldata uints,
        address owner
    ) external initializer {
        // Validate zero address. Make sure: must be an admin exist
        PoolLogic.validAddress(owner);

        __EIP712_init(name, version);
        __BasePausable__init(owner);
        PoolLogic.verifyPoolInfo(addrs, uints);
        {
            ignitionFactory = IIgnitionFactory(_msgSender());
        }

        _createAndSetVesting(
            addrs[0],
            uints[13],
            uints[14],
            uints[15],
            uints[16],
            uints[17]
        );
        {
            PoolLogic.validAddress(addrs[1]);
            purchaseToken = IERC20(addrs[1]);
        }
        {
            maxPurchaseAmountForKYCUser = uints[0];
            maxPurchaseAmountForNotKYCUser = uints[1];
            if (maxPurchaseAmountForKYCUser <= maxPurchaseAmountForNotKYCUser) {
                revert Errors.MaxPurchaseForKYCUserNotValid();
            }
        }
        {
            tokenFeePercentage = SafeCast.toUint16(uints[2]);
            galaxyParticipationFeePercentage = SafeCast.toUint16(uints[3]);
            crowdfundingParticipationFeePercentage = SafeCast.toUint16(
                uints[4]
            );
            if (galaxyParticipationFeePercentage < ignitionFactory.getMinGalaxyParticipationFeePercentage() ||
                galaxyParticipationFeePercentage > ignitionFactory.getMaxGalaxyParticipationFeePercentage()) {
                revert Errors.GalaxyParticipationFeePercentageNotInRange();
            }

            if (crowdfundingParticipationFeePercentage < ignitionFactory.getMinCrowdfundingParticipationFeePercentage() ||
                crowdfundingParticipationFeePercentage > ignitionFactory.getMaxCrowdfundingParticipationFeePercentage()) {
                revert Errors.CrowdFundingParticipationFeePercentageNotInRange();
            }
        }
        {
            galaxyPoolProportion = SafeCast.toUint16(uints[5]);
            earlyAccessProportion = SafeCast.toUint16(uints[6]);
            totalRaiseAmount = uints[7];

            maxPurchaseAmountForEarlyAccess =
                (totalRaiseAmount * (PERCENTAGE_DENOMINATOR - galaxyPoolProportion) * earlyAccessProportion) /
                PERCENTAGE_DENOMINATOR /
                PERCENTAGE_DENOMINATOR;
        }
        {
            whaleOpenTime = SafeCast.toUint64(uints[8]);
            communityOpenTime = whaleCloseTime = SafeCast.toUint64(
                uints[8] + uints[9]
            );
            communityCloseTime = SafeCast.toUint64(
                communityOpenTime + uints[10]
            );
        }
        {
            offeredCurrency.rate = uints[11];
            offeredCurrency.decimal = uints[12];
        }
    }

    /**
     * @notice Set merkle tree root after snapshoting information of investor
     * @dev Only admin can call it
     * @param _root Root of merkle tree
     */
    function setRoot(bytes32 _root) external onlyAdmin {
        root = _root;
        emit UpdateRoot(root);
    }

    /**
     * @notice Cancel pool: cancel project, nobody can buy token
     * @dev Only admin can call it
     */
    function cancelPool(bool _permanentDelete) external onlyAdmin {
        (uint64 _TGEDate, , , , ) = vesting.getVestingInfo();
        if (block.timestamp >= _TGEDate) {
            if (block.timestamp > (ignitionFactory.getLockupDuration() + _TGEDate)) {
                revert Errors.NotAllowedToCancelAfterLockupTime();
            }
            vesting.setEmergencyCancelled(true);
        }
        // This should be marked as cancelled (paused === cancel)
        _pause();
        vesting.setClaimableStatus(false);
        emit CancelPool(address(this), _permanentDelete);
    }

    /**
     * @notice Update time for galaxy pool and crowdfunding pool
     * @dev Only admin can call it, galaxy pool must be closed before crowdfunding pool
     * @param _newWhaleCloseTime New close time of galaxy pool
     * @param _newCommunityCloseTime New close time of crowdfunding pool
     */
    function updateTime(
        uint64 _newWhaleCloseTime,
        uint64 _newCommunityCloseTime
    ) external onlyAdmin beforeTGEDate {
        if (vesting.isPrivateRaise() && vesting.isFunded()) {
            revert Errors.AlreadyPrivateFunded();
        }

        (uint64 _TGEDate, , , , ) = vesting.getVestingInfo();
        if (whaleOpenTime >= _newWhaleCloseTime ||
                _newWhaleCloseTime >= _newCommunityCloseTime  ||
                _newCommunityCloseTime > _TGEDate) {
            revert Errors.InvalidTime();
        }

        communityOpenTime = whaleCloseTime = _newWhaleCloseTime;
        communityCloseTime = _newCommunityCloseTime;

        emit UpdateTime(
            whaleOpenTime,
            whaleCloseTime,
            communityOpenTime,
            communityCloseTime
        );
    }

    /**
     * @notice Update TGE Date for galaxy pool and crowdfunding pool
     * @dev Only admin can call it, new updated TGE Date must be within x year from the time calling this function
     * @param _newTGEDate New updated TGE Date
     */
    function updateTGEDate(
        uint64 _newTGEDate
    ) external onlyAdmin beforeTGEDate {
        if (communityCloseTime > _newTGEDate) {
            revert Errors.InvalidTime();
        }
        if (tgeUpdateAttempts >= ignitionFactory.getMaximumTGEDateAdjustmentAttempts()) {
            revert Errors.NotAllowedToAdjustTGEDateExceedsAttempts();
        }
        if (_newTGEDate > vesting.getInitialTGEDate() + ignitionFactory.getMaximumTGEDateAdjustment()) {
            revert Errors.NotAllowedToAdjustTGEDateTooFar();
        }
        vesting.updateTGEDate(_newTGEDate);
        tgeUpdateAttempts++;
    }

    /**
     * @notice Investor buy token in galaxy pool
     * @dev Must be in time for whale and pool is not closed
     * @param proof Respective proof for a leaf, which is respective for investor in merkle tree
     * @param _purchaseAmount Purchase amount of investor
     * @param _maxPurchaseBaseOnAllocations Max purchase amount base on allocation of whale
     */
    function buyTokenInGalaxyPool(
        bytes32[] calldata proof,
        uint _purchaseAmount,
        uint _maxPurchaseBaseOnAllocations
    ) external whenNotPaused nonReentrant {
        if (!_validWhaleSession()) {
            revert Errors.TimeOutToBuyIDOToken();
        }

        _preValidatePurchaseInGalaxyPool(
            _msgSender(),
            _purchaseAmount,
            _maxPurchaseBaseOnAllocations
        );
        //  // @fix: Need to check if the purchase amount is exceeds total raise amount
        _preValidatePurchase(_purchaseAmount);

        _internalWhaleBuyToken(
            proof,
            _purchaseAmount,
            _maxPurchaseBaseOnAllocations,
            galaxyParticipationFeePercentage,
            uint8(PoolLogic.PoolType.GALAXY_POOL)
        );
        _updatePurchasingInGalaxyPoolState(_purchaseAmount);
    }

    /**
     * @notice Investor buy token in crowdfunding pool
     * @dev Must be in time for crowdfunding pool and pool is not closed
     * @param proof Respective proof for a leaf, which is respective for investor in merkle tree
     * @param _purchaseAmount Purchase amount of investor
     */
    function buyTokenInCrowdfundingPool(
        bytes32[] calldata proof,
        uint _purchaseAmount
    ) external whenNotPaused nonReentrant {
        // @fix: Need to check if the purchase amount is exceeds total raise amount
        _preValidatePurchase(_purchaseAmount);

        if (_validWhaleSession()) {
            _preValidatePurchaseInEarlyAccess(_purchaseAmount);
            _internalWhaleBuyToken(
                proof,
                _purchaseAmount,
                0,
                crowdfundingParticipationFeePercentage,
                uint8(PoolLogic.PoolType.EARLY_ACCESS)
            );
            _updatePurchasingInEarlyAccessState(_purchaseAmount);

            return;
        }

        if (!_validCommunitySession()) {
            revert Errors.TimeOutToBuyIDOToken();
        }

        _internalNormalUserBuyToken(proof, _purchaseAmount);
    }

    /**
     * @notice Allow to change claimable status of the pool
     * @dev Called only by admin
     * @param _status change vesting status
    */
    function setClaimableStatus(bool _status) external onlyAdmin {
        if (_status == true) {
            if (isFailBeforeTGEDate()) {
                revert Errors.NotAllowedToAllowInvestorToClaim();
            }
        }
        return vesting.setClaimableStatus(_status);
    }

    /**
     * @notice Allow collaborator to fund IDO token into the Pool contract. Should
     * only be called before TGE Date
     *  PRIVATE SALE - Pool must be funded after Community close time to make sure fund amount is consistent
     *  PUBLIC SALE - Pool can be funded any time before TGE Date
     * @dev Called only once
     * @param _IDOToken Address of IDO token
     * @param signature Signature comes from admin to verify IDO token is valid in case of private SALE
    */
    function fundIDOToken(
        IERC20withDec _IDOToken,
        bytes calldata signature
    ) external onlyOwner whenNotPaused nonReentrant beforeTGEDate {
        if (vesting.isFunded()) {
            revert Errors.PoolIsAlreadyFunded();
        }

        IERC20withDec IDOToken = vesting.getIDOToken();

        uint256 fundAmount = getIDOTokenAmountByOfferedCurrency(totalRaiseAmount);

        /// @fix: Total IDO token deposit to the funds always less or equal than total raise amount
        if (address(IDOToken) == address(0)) {
            if (block.timestamp <= communityCloseTime) {
                revert Errors.NotAllowedToFundBeforeCommunityTime();
            }

            if (!_verifyFundAllowanceSignature(_IDOToken, signature)) {
                revert Errors.InvalidSigner();
            }

            vesting.setIDOToken(_IDOToken);

            fundAmount = getIDOTokenAmountByOfferedCurrency(purchasedAmount);
        }

        _forwardToken(
            _IDOToken,
            _msgSender(),
            address(vesting),
            fundAmount
        );

        vesting.setFundedStatus(fundAmount, true);
        emit FundIDOToken(_IDOToken, fundAmount);
    }


    /**
     * @notice Collaborator can claim reduntdant IDO Token after funding
     * @dev In case of public sale, if pool failed at TGE Date, collaborator can claim the whole amount (total raise amount)
     * if pool is fully funded but the purchased amount stills lower than total raise amount, allow to withdraw the redundant
     * @param _beneficiary Address to receive redundant IDO Token
     */
    function withdrawRedundantIDOToken(
        address _beneficiary
    ) external onlyOwner {
        if (redundantIDOTokensWithdrawn) {
            revert RedundantTokensAlreadyWithdrawn();
        }
        redundantIDOTokensWithdrawn = true;

        uint redundantAmount;

        // In case project is not funded at TGE Date
        if (isFailBeforeTGEDate()) {
            uint vestingIDOBalance = IERC20(vesting.getIDOToken()).balanceOf(
                address(vesting)
            );
            redundantAmount = vestingIDOBalance;
        } else {
            (uint64 _TGEDate, , , , ) = vesting.getVestingInfo();
            if (block.timestamp < _TGEDate) {
                revert Errors.NotAllowedToTransferBBeforeTGEDate();
            }
            redundantAmount =
                vesting.getTotalFundedAmount() -
                getIDOTokenAmountByOfferedCurrency(purchasedAmount);
        }
        vesting.withdrawRedundantIDOToken(_beneficiary, redundantAmount);
    }

    /// @notice System's admin receive token fee only when project is success after lockup time
    /// @param _beneficiary Address to receive
    function claimTokenFee(
        address _beneficiary
    )
        external
        onlyAdmin
        whenNotPaused
        onlyFunded
        nonReentrant
        afterLockupTime
        notEmergencyCancelled
    {
        if (tokenFeeClaimedStatus == true) {
            revert Errors.NotAllowedToClaimTokenFee();
        }
        uint tokenFee = (purchasedAmount * tokenFeePercentage) /
            PERCENTAGE_DENOMINATOR;

        purchaseToken.safeTransfer(_beneficiary, tokenFee);
        tokenFeeClaimedStatus = true;

        emit ClaimTokenFee(_beneficiary, tokenFee);
    }

    /// @notice System's admin participation token fee only when project is success after lockup time
    /// @param _beneficiary Address to receive
    function claimParticipationFee(
        address _beneficiary
    )
        external
        onlyAdmin
        whenNotPaused
        onlyFunded
        nonReentrant
        afterLockupTime
        notEmergencyCancelled
    {
        if (participationFeeClaimedStatus == true) {
            revert Errors.NotAllowedToClaimParticipationFee();
        }
        purchaseToken.safeTransfer(_beneficiary, participationFeeAmount);
        participationFeeClaimedStatus = true;

        emit ClaimParticipationFee(_beneficiary, participationFeeAmount);
    }

    /// @notice When project is fail (cancelled by admin or not be funded enough IDO token)
    /// @param _beneficiary Address of receiver
    function withdrawPurchasedAmount(
        address _beneficiary
    ) external nonReentrant {
        if (!isFailBeforeTGEDate() && !vesting.isEmergencyCancelled()) {
            revert Errors.NotAllowedToWithdrawPurchasedAmount();
        }

        PurchaseAmount storage userInfo = userPurchasedAmount[_msgSender()];

        if (userInfo.withdrawn != 0) {
            revert Errors.NotAllowedToWithdrawPurchasedAmount();
        }

        // Did the user claim any tokens before cancellation of IDO?
        // If so, we need to subtract the amount from the total purchase amount
        (, uint claimedAmount) = vesting.getVestingInfoForAddress(_msgSender());
        uint claimedAmountOfPurchase = getPurchaseTokenAmountByTokenAmount(claimedAmount);

        uint principalAmount = userInfo.principal;
        uint feeAmount = userInfo.fee;
        uint amount = principalAmount + feeAmount - claimedAmountOfPurchase;

        // require(amount > 0, Errors.ZERO_AMOUNT_NOT_VALID);
        if (amount == 0) {
            revert Errors.ZeroAmountNotValid();
        }

        purchaseToken.safeTransfer(_beneficiary, amount);
        userInfo.withdrawn = amount;

        emit WithdrawPurchasedAmount(_msgSender(), _beneficiary, amount);
    }

    /**
     * @dev Claim tokens for investors
     * @param _beneficiary Address to receive amount of purchased token
     */
    function claimFund(
        address _beneficiary
    )
        external
        onlyOwner
        whenNotPaused
        onlyFunded
        nonReentrant
        afterLockupTime
        notEmergencyCancelled
    {
        if (!vesting.isClaimable()) {
            revert Errors.NotAllowedToClaimPurchaseToken();
        }

        uint claimableAmount = getClaimableFundAmount();
        if (claimableAmount <= 0) {
            revert Errors.InvalidClaimableAmount();
        }

        if (fundClaimedAmount == claimableAmount) {
            revert Errors.AlreadyClaimTotalAmount();
        }

        claimableAmount = claimableAmount <=
            purchaseToken.balanceOf(address(this))
            ? claimableAmount
            : purchaseToken.balanceOf(address(this));
        fundClaimedAmount += claimableAmount;

        purchaseToken.safeTransfer(_beneficiary, claimableAmount);

        emit ClaimFund(_beneficiary, claimableAmount);
    }

    // ============================== PUBLIC FUNCTION ==============================

    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() public view virtual returns (bytes32) {
        return _domainSeparatorV4();
    }

    function isFailBeforeTGEDate() public view returns (bool) {
        (uint64 _TGEDate, , , , ) = vesting.getVestingInfo();
        return (paused() ||
            (!vesting.isFunded() && block.timestamp >= _TGEDate));
    }

    /**
     * @dev Get IDO token amount base on amount of purchase token
     * @param _amount Amount of purchase token
     * @return Return amount of respective IDO token
     */
    function getIDOTokenAmountByOfferedCurrency(
        uint _amount
    ) public view returns (uint) {
        return
            (_amount * offeredCurrency.rate) / (10 ** offeredCurrency.decimal);
    }

     /**
     * @dev Get purchase token amount base on amount of IDO tokens
     * @param _tokenAmount Amount of IDO token
     * @return Return amount of respective purchase token
     */
    function getPurchaseTokenAmountByTokenAmount(
        uint _tokenAmount
    ) public view returns (uint) {
        // Ensure rate is valid
        require(offeredCurrency.rate > 0, "Conversion rate must be greater than zero");
        return (_tokenAmount * (10 ** offeredCurrency.decimal)) / offeredCurrency.rate;
    }

    /// @notice Calculate total claimable purchased token during vesting period
    function getClaimableFundAmount() public view returns (uint) {
        uint tokenFee = (purchasedAmount * tokenFeePercentage) /
            PERCENTAGE_DENOMINATOR;
        uint totalFundAmount = purchasedAmount - tokenFee;
        // (
        //     uint64 _TGEDate,
        //     uint16 _TGEPercentage,
        //     uint64 _vestingCliff,
        //     uint64 _vestingFrequency,
        //     uint _numberOfVestingRelease
        // ) = vesting.getVestingInfo();

        // return
        //     VestingLogic.calculateClaimableAmount(
        //         totalFundAmount,
        //         fundClaimedAmount,
        //         _TGEPercentage,
        //         _TGEDate,
        //         _vestingCliff,
        //         _vestingFrequency,
        //         _numberOfVestingRelease
        //     );

        return totalFundAmount;
    }

    // ============================== INTERNAL FUNCTION ==============================

    function _createAndSetVesting(
        address _IDOToken,
        uint _TGEDate,
        uint _TGEPercentage,
        uint _vestingCliff,
        uint _vestingFrequency,
        uint _numberOfVestingRelease
    ) internal {
        address _vesting = IIgnitionFactory(ignitionFactory).createVesting();
        vesting = IVesting(_vesting);
        vesting.initialize(
            address(this),
            _IDOToken,
            _TGEDate,
            _TGEPercentage,
            _vestingCliff,
            _vestingFrequency,
            _numberOfVestingRelease
        );
    }

    function _verifyFundAllowanceSignature(
        IERC20withDec _IDOToken,
        bytes calldata signature
    ) internal view returns (bool) {
        bytes32 symbolHash = keccak256(abi.encodePacked(_IDOToken.symbol()));
        uint8 decimals = _IDOToken.decimals();
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR(),
                keccak256(
                    abi.encode(
                        FUND_TYPEHASH,
                        address(_IDOToken),
                        address(this),
                        symbolHash,
                        decimals
                    )
                )
            )
        );

        return ignitionFactory.isOwner(ECDSA.recover(digest, signature));
    }

    /**
     * @dev Internal function for whale to buy token
     * @param proof Respective proof for a leaf, which is respective for investor in merkle tree
     * @param _purchaseAmount Purchase amount of investor
     * @param _maxPurchaseBaseOnAllocations Max purchase amount base on allocation of whale
     * @param _participationFeePercentage Fee percentage when buying token
     * @param _poolType 0 for galaxy pool, 1 for early access and 2 for normal user in crowdfunding pool
     */
    function _internalWhaleBuyToken(
        bytes32[] calldata proof,
        uint _purchaseAmount,
        uint _maxPurchaseBaseOnAllocations,
        uint _participationFeePercentage,
        uint8 _poolType
    ) internal {
        bool verifyWithKYCed = _verifyUser(
            _msgSender(),
            WHALE,
            maxPurchaseAmountForKYCUser,
            _maxPurchaseBaseOnAllocations,
            proof
        );
        if (verifyWithKYCed) {
            _internalBuyToken(
                _msgSender(),
                _purchaseAmount,
                _participationFeePercentage,
                true,
                _poolType
            );
            return;
        }

        bool verifyWithoutKYC = _verifyUser(
            _msgSender(),
            WHALE,
            maxPurchaseAmountForNotKYCUser,
            _maxPurchaseBaseOnAllocations,
            proof
        );

        // require(verifyWithoutKYC, Errors.NOT_IN_WHALE_LIST);
        if (!verifyWithoutKYC) {
            revert Errors.NotInWhaleList();
        }

        _internalBuyToken(
            _msgSender(),
            _purchaseAmount,
            _participationFeePercentage,
            false,
            _poolType
        );
    }

    /**
     * @dev Internal function for normal user to buy token
     * @param proof Respective proof for a leaf, which is respective for investor in merkle tree
     * @param _purchaseAmount Purchase amount of investor
     */
    function _internalNormalUserBuyToken(
        bytes32[] calldata proof,
        uint _purchaseAmount
    ) internal {
        uint8 poolType = uint8(PoolLogic.PoolType.NORMAL_ACCESS);
        bool verifyWithKYCed = _verifyUser(
            _msgSender(),
            NORMAL_USER,
            maxPurchaseAmountForKYCUser,
            0,
            proof
        );
        if (verifyWithKYCed) {
            _internalBuyToken(
                _msgSender(),
                _purchaseAmount,
                crowdfundingParticipationFeePercentage,
                true,
                poolType
            );
            return;
        }

        bool verifyWithoutKYC = _verifyUser(
            _msgSender(),
            NORMAL_USER,
            maxPurchaseAmountForNotKYCUser,
            0,
            proof
        );

        // require(verifyWithoutKYC, Errors.NOT_IN_INVESTOR_LIST);
        if (!verifyWithoutKYC) {
            revert Errors.NotInInvestorList();
        }

        _internalBuyToken(
            _msgSender(),
            _purchaseAmount,
            crowdfundingParticipationFeePercentage,
            false,
            poolType
        );
    }

    /**
     * @dev Internal function to buy token
     * @param buyer Address of investor
     * @param _purchaseAmount Purchase amount of investor
     * @param _participationFeePercentage Fee percentage when buying token
     * @param _KYCStatus True if investor KYC and vice versa
     * @param _poolType 0 for galaxy pool, 1 for early access and 2 for normal user in crowdfunding pool
     */
    function _internalBuyToken(
        address buyer,
        uint _purchaseAmount,
        uint _participationFeePercentage,
        bool _KYCStatus,
        uint8 _poolType
    ) internal {
        if (_KYCStatus == true) {
            if (userPurchasedAmount[buyer].principal + _purchaseAmount >
                    maxPurchaseAmountForKYCUser) {
                revert Errors.ExceedMaxPurchaseAmountForKYCUser();
            }
        } else {
            if (userPurchasedAmount[buyer].principal + _purchaseAmount >
                    maxPurchaseAmountForNotKYCUser) {
                revert Errors.ExceedMaxPurchaseAmountForNonKYCUser();
            }
        }

        uint participationFee = PoolLogic.calculateParticipantFee(
            _purchaseAmount,
            _participationFeePercentage
        );

        // allowance check
        _verifyAllowance(_msgSender(), _purchaseAmount + participationFee);

        _handleParticipationFee(buyer, participationFee);
        _handlePurchaseTokenFund(buyer, _purchaseAmount);

        uint IDOTokenAmount = getIDOTokenAmountByOfferedCurrency(
            _purchaseAmount
        );
        vesting.createVestingSchedule(buyer, IDOTokenAmount);

        emit BuyToken(buyer, address(this), _purchaseAmount, IDOTokenAmount, _poolType);
    }

    function _handlePurchaseTokenFund(
        address _buyer,
        uint _purchaseAmount
    ) internal {
        _forwardPurchasedToken(_buyer, _purchaseAmount);
        _updatePurchasingState(_buyer, _purchaseAmount);
    }

    function _handleParticipationFee(
        address _buyer,
        uint _participationFee
    ) internal {
        if (_participationFee > 0) {
            _forwardPurchasedToken(_buyer, _participationFee);
            _updateParticipationFee(_buyer, _participationFee);
        }
    }

    function _forwardPurchasedToken(
        address _addr,
        uint _amount
    ) internal {
        purchaseToken.safeTransferFrom(
            _addr,
            address(this),
            _amount
        );
    }

    function _updateParticipationFee(
        address _buyer,
        uint _participationFee
    ) internal {
        userPurchasedAmount[_buyer].fee += _participationFee;
        participationFeeAmount += _participationFee;
    }

    /**
     * @dev Update purchasing amount in galaxy pool
     * @param _purchaseAmount Purchase amount of investor
     */
    function _updatePurchasingInGalaxyPoolState(uint _purchaseAmount) internal {
        // Update Whale Purchase Amount
        whalePurchasedAmount[_msgSender()] += _purchaseAmount;
        purchasedAmountInGalaxyPool += _purchaseAmount;
    }

    /**
     * @dev Update purchasing amount in early access
     * @param _purchaseAmount Purchase amount of investor
     */
    function _updatePurchasingInEarlyAccessState(
        uint _purchaseAmount
    ) internal {
        purchasedAmountInEarlyAccess += _purchaseAmount;
    }

    /**
     * @dev Update purchasing amount, airdrop amount and TGE amount in all pools
     * @param _purchaseAmount Purchase amount of investor
     */
    function _updatePurchasingState(
        address _buyer,
        uint _purchaseAmount
    ) internal {
        userPurchasedAmount[_buyer].principal += _purchaseAmount;
        purchasedAmount += _purchaseAmount;
    }

    function _forwardToken(
        IERC20withDec token,
        address sender,
        address receiver,
        uint amount
    ) internal {
        token.safeTransferFrom(sender, receiver, amount);
    }

    /**
     * @dev Check whether or not purchase amount exceeds max purchase in early access for whale
     * @param _purchaseAmount Purchase amount of investor
     */
    function _preValidatePurchaseInEarlyAccess(
        uint _purchaseAmount
    ) internal view {
        PoolLogic.validAmount(_purchaseAmount);
        if (purchasedAmountInEarlyAccess + _purchaseAmount >
                maxPurchaseAmountForEarlyAccess) {
            revert Errors.ExceedMaxPurchaseAmountForEarlyAccess();
        }
    }

     /**
     * @dev Check whether or not purchase amount exceeds max purchase amount base on allocation for whale
     * @param _purchaseAmount Amount of purchase token
     * @param _maxPurchaseBaseOnAllocations Max purchase amount base on allocations for whale
     */
    function _preValidatePurchaseInGalaxyPool(
        address _whaleAddress,
        uint _purchaseAmount,
        uint _maxPurchaseBaseOnAllocations
    ) internal view {
        PoolLogic.validAmount(_purchaseAmount);
        if (whalePurchasedAmount[_whaleAddress] +  _purchaseAmount > _maxPurchaseBaseOnAllocations) {
            revert Errors.ExceedMaxPurchaseAmountForUser();
        }
    }

    /**
     * @dev Check whether or not purchase amount exceeds amount in all pools
     * @param _purchaseAmount Purchase amount of investor
     */
    function _preValidatePurchase(uint _purchaseAmount) internal view {
        PoolLogic.validAmount(_purchaseAmount);
        if (purchasedAmount + _purchaseAmount > totalRaiseAmount) {
            revert Errors.ExceedTotalRaiseAmount();
        }
    }

    /**
     * @dev Check whether or not session of whale
     * @return Return true if yes, and vice versa
     */
    function _validWhaleSession() internal view returns (bool) {
        return
            block.timestamp > whaleOpenTime &&
            block.timestamp <= whaleCloseTime;
    }

    /**
     * @dev Check whether or not session of community user
     * @return Return true if yes, and vice versa
     */
    function _validCommunitySession() internal view returns (bool) {
        return
            block.timestamp > communityOpenTime &&
            block.timestamp <= communityCloseTime;
    }

    /**
     * @dev Verify allowance of investor's token for pool
     * @param _user Address of investor
     * @param _purchaseAmount Purchase amount of investor
     */
    function _verifyAllowance(
        address _user,
        uint _purchaseAmount
    ) private view {
        uint allowance = purchaseToken.allowance(_user, address(this));
        if (allowance < _purchaseAmount) {
            revert Errors.NotEnoughAllowance();
        }
    }
}
