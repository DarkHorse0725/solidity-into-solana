// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "../interfaces/IIgnitionFactory.sol";
import "../interfaces/IVesting.sol";

contract PoolStorage {
    /// @dev rate and decimal to display price of IDO token
    struct OfferedCurrency {
        uint rate;
        uint decimal;
    }

    /// @dev amount of purchase token, fee used to buy IDO token and withdrawn amount status if project failed
    struct PurchaseAmount {
        uint principal; // purchased amount(based on purchased token)
        uint fee; // participation fee (based on purchased token)
        uint withdrawn;
    }

    // // Cache the domain separator as an immutable value, but also store the chain id that it corresponds to, in order to
    // // invalidate the cached domain separator if the chain id changes.
    // bytes32 private immutable _cachedDomainSeparator;
    // uint256 private immutable _cachedChainId;
    // address private immutable _cachedThis;

    // bytes32 private immutable _hashedName;
    // bytes32 private immutable _hashedVersion;

    // bytes32 private constant TYPE_HASH =
    //     keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

    /// @dev keccak256("WHALE")
    bytes32 public constant WHALE =
        0xed4b80c86c7954bdbf516c492acb4a2899eb0ee85b7c74e26d85e55a07562c95;

    /// @dev keccak256("NORMAL_USER")
    bytes32 public constant NORMAL_USER =
        0x13e31188d81b941f4c541528790db4031bef078b78d364bde6fc2d4e5ad79e01;

    /// @dev Percentage denominator
    uint16 public constant PERCENTAGE_DENOMINATOR = 10000;

    // bytes32 public constant FUND_TYPEHASH = keccak256("Fund(address IDOToken,address pool,string symbol,uint8 decimals)");
    bytes32 public constant FUND_TYPEHASH =
        0x52d52760e40624a39bea36339850f64206470d82f714f11095b454fbff6de952;

    /// @dev Name used for fund signature
    string public constant name = "Pool";

    /// @dev Version used for fund signature
    string public constant version = "1";

    /// @dev Address of pool factory
    IIgnitionFactory public ignitionFactory;

    /// @dev Address of purchase token
    IERC20 public purchaseToken;

    /// @dev Store rate and decimal to display price of IDO token
    OfferedCurrency public offeredCurrency;

    /// @dev Max purchase amount for early access = (total raise amount - total raise amount * galaxy pool proportion) * early access proportion
    uint public maxPurchaseAmountForEarlyAccess;

    /// @dev Max purchase amount for KYC user
    uint public maxPurchaseAmountForKYCUser;

    /// @dev Max purchase amount for NOT KYC user
    uint public maxPurchaseAmountForNotKYCUser;

    /// @dev Token fee to create project
    uint16 public tokenFeePercentage;

    /// @dev True if token fee is claimed
    bool public tokenFeeClaimedStatus;

    /// @dev Fee percentage when buying token in galaxy pool
    uint16 public galaxyParticipationFeePercentage;

    /// @dev Fee percentage when buying token in crowdfunding pool
    uint16 public crowdfundingParticipationFeePercentage;

    /// @dev Proportion of total raise for galaxy pool
    uint16 public galaxyPoolProportion;

    /// @dev Proportion of crowdfunding pool amount for early access
    uint16 public earlyAccessProportion;

    /// @dev Total raise amount of all pools (based on purchase token)
    uint public totalRaiseAmount;

    /// @dev Open time of galaxy pool
    uint64 public whaleOpenTime;

    /// @dev Close time of galaxy pool
    uint64 public whaleCloseTime;

    /// @dev Open time for community user = Close time of galaxy pool
    uint64 public communityOpenTime;

    /// @dev Close time of crowdfunding pool
    uint64 public communityCloseTime;

    /// @dev Participation fee in all sub-pool (based on purchase token)
    uint public participationFeeAmount;

    /// @dev True if participation fee is claimed
    bool public participationFeeClaimedStatus;

    /// @dev Purchased amount in galaxy pool (based on purchase token), do not include participation fee
    uint public purchasedAmountInGalaxyPool;

    /// @dev Purchased amount in early access (based on purchase token), do not include participation fee
    uint public purchasedAmountInEarlyAccess;

    /// @dev Purchased amount in all pools (based on purchase token), do not include participation fee
    uint public purchasedAmount;

    /// @dev Fund amount which is claimed by collaborator (exclude token fee)
    uint public fundClaimedAmount;

    /// @dev Mapping from User to purchased amount (based on purchase token)
    mapping(address => PurchaseAmount) public userPurchasedAmount;

    /// @dev Whale address to whale purchased amount by allocation
    mapping(address => uint256) public whalePurchasedAmount;

    /// @dev Vesting contract address
    IVesting public vesting;

    // @dev How many times TGE date has been updated
    uint8 public tgeUpdateAttempts;

    // @dev How many times TGE date has been updated
    bool internal redundantIDOTokensWithdrawn;
}
