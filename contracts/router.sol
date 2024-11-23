// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Interfaces/IMerchant.sol";
import "./Interfaces/IUser.sol";
import "./Interfaces/IUserFactory.sol";
import "./Interfaces/IInvestor.sol";
import "./Interfaces/IInvestorPool.sol";
import "./Interfaces/IInvestorPoolFactory.sol";

// import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Router Contract
/// @notice Handles routing of subscriptions, loans and payments between users, merchants and investors
contract Router is Ownable{

    using Counters for Counters.Counter;
    /// @notice Counter for total number of subscriptions
    Counters.Counter public subscriptionCount;
    /// @notice Counter for total number of subscription payments
    Counters.Counter public subscriptionPaymentCount;
    /// @notice Counter for total number of loans disbursed
    Counters.Counter public disbursedCount;

    /// @notice Address of the user factory contract
    address public userFactoryAddress;
    /// @notice Address of the investor factory contract
    address public investorFactoryAddress;
    /// @notice Address of the merchant factory contract
    address public merchantFactoryAddress;

    /// @notice Emitted when a new subscription is created
    /// @param subscriptionId Unique identifier for the subscription
    /// @param userAccount Address of the user's account
    /// @param merchantAccount Address of the merchant's account
    /// @param tier Subscription tier level
    /// @param subTime Timestamp when subscription was created
    event Sub(uint256 indexed subscriptionId, address userAccount, address merchantAccount, uint256 tier, uint256 subTime);
    event SubscriptionPayment(uint256 indexed paymentId, address userAccount, address merchantAccount, uint256 paymentAmount, uint256 paymentTime);
    event LoanDisbursed(uint256 indexed disbursedId, address investorAccount, address merchantAccount, uint256 amount, uint8 loanCategory);

    constructor() Ownable(msg.sender) {}

    /// @notice Sets the factory contract addresses
    /// @param _userFactoryAddress Address of the user factory contract
    /// @param _investorFactoryAddress Address of the investor factory contract
    /// @param _merchantFactoryAddress Address of the merchant factory contract
    function setFactory(address _userFactoryAddress, address _investorFactoryAddress, address _merchantFactoryAddress) onlyOwner external {
        userFactoryAddress = _userFactoryAddress;
        investorFactoryAddress = _investorFactoryAddress;
        merchantFactoryAddress = _merchantFactoryAddress;
    }

    /// @notice Creates a new subscription for a user
    /// @param tier Subscription tier level
    /// @param merchantAccount Address of the merchant's account
    function subscribe(uint8 tier, address merchantAccount) external {
        // pull free trial from merchant account
        uint256 freeTrial = IMerchant(merchantAccount).freeTrial();
        // pull the userAccount from userAccount factory
        address userAccount = IUserFactory(userFactoryAddress).getAccountAddress(msg.sender);
        uint256 paymentDue = freeTrial + block.timestamp;
        // call subscribe on merchant and user accounts
        IUser(userAccount).subscribe(tier, paymentDue, merchantAccount);
        IMerchant(merchantAccount).setSubscription(tier, paymentDue, userAccount);

        uint256 subId = subscriptionCount.current();
        subscriptionCount.increment();
        emit Sub(subId, userAccount, merchantAccount, tier, block.timestamp);
    }

    /// @notice Allows an investor to fund a merchant's loan request
    /// @param merchantAccount Address of the merchant requesting the loan
    function fundRequest(address merchantAccount) external {
        address investorAccount = IUserFactory(investorFactoryAddress).getAccountAddress(msg.sender);
        require(investorAccount != address(0), "Create an Account");
        ( , uint256 loanAmount, uint256 interest, , , uint256 loanPeriod, uint256 monthlyRepaymentAmount) = IMerchant(merchantAccount).currentLoanRequest();
        IMerchant(merchantAccount).receiveLoan(investorAccount);
        IInvestor(investorAccount).acceptRequest(merchantAccount, loanAmount, interest, loanPeriod, monthlyRepaymentAmount);
        // emit event
        uint256 disbursedId = disbursedCount.current();
        disbursedCount.increment();
        emit LoanDisbursed(disbursedId, investorAccount, merchantAccount, loanAmount, 0);
    }

    /// @notice Allows a merchant to accept a loan offer from an investor
    /// @param investorAccount Address of the investor's account
    /// @param offerId Unique identifier of the loan offer
    function acceptOffer(address investorAccount, uint256 offerId) external {
        (address investor, uint256 loanAmount, , , uint256 loanPeriod, uint256 monthlyRepaymentAmount) = IInvestor(investorAccount).offers(offerId);
        address merchantAccount = IUserFactory(merchantFactoryAddress).getAccountAddress(msg.sender);
        uint256 repaymentAmount = monthlyRepaymentAmount * loanPeriod;
        IMerchant(merchantAccount).getLoan(investor, repaymentAmount, loanPeriod, monthlyRepaymentAmount);
        IInvestor(investor).disburseLoanOffer(merchantAccount, offerId);
        uint256 disbursedId = disbursedCount.current();
        disbursedCount.increment();
        emit LoanDisbursed(disbursedId, investorAccount, merchantAccount, loanAmount, 1);
    }

    /// @notice Allows a merchant to get a loan from an investor pool
    /// @param investorPool Address of the investor pool
    /// @param loanAmount Amount of the loan requested
    function getLoan(address investorPool, uint256 loanAmount) external {
        address merchantAccount = IUserFactory(merchantFactoryAddress).getAccountAddress(msg.sender);
        uint256 interest = IInvestorPool(investorPool).interest();
        uint256 loanPeriod = IInvestorPool(investorPool).loanPeriod();
        uint256 repaymentAmount = ((interest / 100) * loanAmount) + loanAmount;
        uint256 monthlyRepaymentAmount = repaymentAmount / loanPeriod;
        IMerchant(merchantAccount).getLoan(investorPool, repaymentAmount, loanPeriod, monthlyRepaymentAmount);
        IInvestorPool(investorPool).getLoan(merchantAccount, loanAmount, loanPeriod);
        uint256 disbursedId = disbursedCount.current();
        disbursedCount.increment();
        emit LoanDisbursed(disbursedId, investorPool, merchantAccount, loanAmount, 2);
    }

    /// @notice Processes a subscription payment charge
    /// @param userAccount Address of the user's account
    /// @param merchantAccount Address of the merchant's account
    /// @param amount Payment amount
    function charge(address userAccount, address merchantAccount, uint256 amount) external {
        IUser(userAccount).paySubscription(amount, merchantAccount);
        
        uint256 paymentId = subscriptionPaymentCount.current();
        subscriptionPaymentCount.increment();
        emit SubscriptionPayment(paymentId, userAccount, merchantAccount, amount, block.timestamp);
    }

    /// @notice Allows an investor to contribute to an investor pool
    /// @param investorPool Address of the investor pool
    /// @param amount Amount to contribute
    function contributePool(address investorPool, uint256 amount) external {
        address investorAccount = IUserFactory(investorFactoryAddress).getAccountAddress(msg.sender);
        IInvestor(investorAccount).contributePool(investorPool, amount);
        IInvestorPool(investorPool).contribute(investorAccount, amount);
    }
}