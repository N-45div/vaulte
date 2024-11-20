// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Interfaces/IMerchant.sol";
import "./Interfaces/IUser.sol";
import "./Interfaces/IUserFactory.sol";
import "./Interfaces/IInvestor.sol";
import "./Interfaces/IInvestorPool.sol";
import "./Interfaces/IInvestorPoolFactory.sol";

// import "@openzeppelin/contracts/utils/Counters.sol";

contract Router is Ownable{

    address public userFactoryAddress;
    address public userFactoryAddress;

    event Subscription(address userAccount, address merchantAccount, uint256 tier, uint256 subTime);
    event SubscriptionPayment(address userAccount, address merchantAccount, uint256 paymentAmount, uint256 paymentTime);
    event LoanDisbursed(address investorAccount, address merchantAccount, uint256 amount, uint8 loanCategory);

    constructor() Ownable(msg.sender) {}

    function setFactory(address _userFactoryAddress, ) onlyOwner external {
        userFactoryAddress = _userFactoryAddress;
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

        emit Subscription(userAccount, merchantAccount, tier, block.timestamp);
    }

    function fundRequest(address merchantAccount) external {
        address investorAccount = IUserFactory(userFactoryAddress).getAccountAddress(msg.sender);
        require(investorAccount != address(0), "Create an Account");
        ( , uint256 loanAmount, uint256 interest, , , uint256 loanPeriod, uint256 monthlyRepaymentAmount) = IMerchant(merchantAccount).currentLoanRequest();
        IMerchant(merchantAccount).receiveLoan(investorAccount);
        IInvestor(investorAccount).acceptRequest(merchantAccount, loanAmount, interest, loanPeriod, monthlyRepaymentAmount);
        // emit event
        emit LoanDisbursed(investorAccount, merchantAccount, loanAmount, 0);
    }

    function acceptOffer(address investorAccount, uint256 offerId) external {
        (address investor, uint256 loanAmount, , , uint256 loanPeriod, uint256 monthlyRepaymentAmount) = IInvestor(investorAccount).offers(offerId);
        address merchantAccount = IUserFactory(userFactoryAddress).getAccountAddress(msg.sender);
        uint256 repaymentAmount = monthlyRepaymentAmount * loanPeriod;
        IMerchant(merchantAccount).getLoan(investor, repaymentAmount, loanPeriod, monthlyRepaymentAmount);
        IInvestor(investor).disburseLoanOffer(merchantAccount, offerId);
        emit LoanDisbursed(investorAccount, merchantAccount, loanAmount, 1);
    }

    function getLoan(address investorPool, uint256 loanAmount) external {
        address merchantAccount = IUserFactory(userFactoryAddress).getAccountAddress(msg.sender);
        uint256 interest = IInvestorPool(investorPool).interest();
        uint256 loanPeriod = IInvestorPool(investorPool).loanPeriod();
        uint256 repaymentAmount = ((interest / 100) * loanAmount) + loanAmount;
        uint256 monthlyRepaymentAmount = repaymentAmount / loanPeriod;
        IMerchant(merchantAccount).getLoan(investorPool, repaymentAmount, loanPeriod, monthlyRepaymentAmount);
        IInvestorPool(investorPool).getLoan(merchantAccount, loanAmount, loanPeriod);
        emit LoanDisbursed(investorPool, merchantAccount, loanAmount, 2);
    }

    function charge(address userAccount, address merchantAccount, uint256 amount) external {
        IUser(userAccount).paySubscription(amount, merchantAccount);
        emit SubscriptionPayment(userAccount, merchantAccount, amount, block.timestamp);
    }

    function contributePool(address investorPool, uint256 amount) external {
        
        IInvestorPool(investorPool).
    }
}