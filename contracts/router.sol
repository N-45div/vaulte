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

contract Router is Ownable{

    using Counters for Counters.Counter;
    Counters.Counter public subscriptionCount;
    Counters.Counter public subscriptionPaymentCount;
    Counters.Counter public disbursedCount;

    address public userFactoryAddress;
    address public investorFactoryAddress;
    address public merchantFactoryAddress;

    event Subscription(uint256 indexed subscriptionId, address userAccount, address merchantAccount, uint256 tier, uint256 subTime);
    event SubscriptionPayment(uint256 indexed paymentId, address userAccount, address merchantAccount, uint256 paymentAmount, uint256 paymentTime);
    event LoanDisbursed(uint256 indexed disbursedId, address investorAccount, address merchantAccount, uint256 amount, uint8 loanCategory);

    constructor() Ownable(msg.sender) {}

    function setFactory(address _userFactoryAddress, address _investorFactoryAddress, address _merchantFactoryAddress) onlyOwner external {
        userFactoryAddress = _userFactoryAddress;
        investorFactoryAddress = _investorFactoryAddress;
        merchantFactoryAddress = _merchantFactoryAddress;
    }

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
        emit Subscription(subId, userAccount, merchantAccount, tier, block.timestamp);
    }

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

    function charge(address userAccount, address merchantAccount, uint256 amount) external {
        IUser(userAccount).paySubscription(amount, merchantAccount);
        
        uint256 paymentId = subscriptionPaymentCount.current();
        subscriptionPaymentCount.increment();
        emit SubscriptionPayment(paymentId, userAccount, merchantAccount, amount, block.timestamp);
    }

    function contributePool(address investorPool, uint256 amount) external {
        address investorAccount = IUserFactory(investorFactoryAddress).getAccountAddress(msg.sender);
        IInvestor(investorAccount).contributePool(investorPool, amount);
        IInvestorPool(investorPool).contribute(investorAccount, amount);
    }
}