// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

library Errors {
    error CallerNotAdmin();
    error CallerNotOwner();
    error ZeroAmountNotValid();
    error ZeroAddressNotValid();
    error InvalidTokenFeePercentage();
    error InvalidTgePercentage();
    error InvalidGalaxyPoolProportion();
    error InvalidEarlyAccessProportion();
    error InvalidTime();
    error InvalidSigner();
    error InvalidClaimableAmount();
    error NotInWhaleList();
    error NotInInvestorList();
    error NotEnoughAllowance();
    error NotFunded();
    error AlreadyClaimTotalAmount();
    error TimeOutToBuyIDOToken();

    error ExceedMaxPurchaseAmountForUser();
    error ExceedTotalRaiseAmount();
    error ExceedMaxPurchaseAmountForKYCUser();
    error ExceedMaxPurchaseAmountForNonKYCUser();
    error ExceedMaxPurchaseAmountForEarlyAccess();

    error NotAllowedToClaimIDOToken();
    error NotAllowedToClaimTokenFee();
    error NotAllowedToDoAfterTGEDate();
    error NotAllowedToClaimParticipationFee();
    error NotAllowedToWithdrawPurchasedAmount();
    error NotAllowedToFundAfterTGEDate();
    error NotAllowedToAllowInvestorToClaim();
    error NotAllowedToClaimPurchaseToken();
    error NotAllowedToTransferBBeforeTGEDate();
    error NotAllowedToTransferBeforeLockupTime();
    error NotAllowedToDoAfterEmergencyCancelled();
    error NotAllowedToCancelAfterLockupTime();
    error NotAllowedToExceedTotalRaiseAmount();
    error NotAllowedToFundBeforeCommunityTime();

    error GalaxyParticipationFeePercentageNotInRange();
    error CrowdFundingParticipationFeePercentageNotInRange();

    error NotAllowedToAdjustTGEDateExceedsAttempts();

    error MaxPurchaseForKYCUserNotValid();

    error PoolIsAlreadyFunded();

    error NotAllowedToAdjustTGEDateTooFar();

    error AlreadyPrivateFunded();
}
