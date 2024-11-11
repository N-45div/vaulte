// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IRouter.sol";

contract MerchantAccount is Ownable{

    /**
     * @notice Utilizing OpenZeppelin's Counters library for managing counters, which includes functions like increment, decrement, and reset.
     */
    using Counters for Counters.Counter;

    /**
     * @notice Counter for tracking the number of subscribtions.
     */
    Counters.Counter public _subscriptionCount;

    uint256 public freeTrial;
    address public usde;
    address public routerAddress;

    struct loan {
        address investor;
        uint256 repaymentAmount;
        uint256 repaidAmount;
        uint256 loanPeriod;
        uint256 monthlyRepaymentAmount;
    }
    
    struct subscription {
        address userAccount;
        uint256 paymentDue;
        bool status;
        uint8 tier;
    }

    loan public currentLoan;
    loan public currentLoanRequest;

    mapping (uint256 => subscription) public subscriptions;
    mapping (uint8 => uint256) public prices;

    constructor(address _routerAddress, address usdeAddress, address owner) Ownable(owner) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    function getPrice(uint8 tier) public view returns(uint256) {
        return prices[tier];
    }

    function setPrice(uint8 tier, uint256 price) public onlyOwner() {
        prices[tier] = price;
    }

    function setFreeTrial(uint256 trialPeriod) public onlyOwner() {
        freeTrial = trialPeriod;
    }

    function withdraw(uint256 amount, address tokenAddress) public onlyOwner {
        IERC20(tokenAddress).transfer(msg.sender, amount);
    }

    function setSubscription(uint8 tier, uint256 paymentDue, address userAccount) external onlyRouter() {
        subscriptions[_subscriptionCount.current()].userAccount = userAccount;
        subscriptions[_subscriptionCount.current()].paymentDue = paymentDue;
        subscriptions[_subscriptionCount.current()].tier = tier;
        subscriptions[_subscriptionCount.current()].status = true;
    }

    // function to be automated
    function chargeSubscription() external {
        for (uint i = 0; i < _subscriptionCount.current(); i++) {
            if (subscriptions[i].paymentDue >= block.timestamp) {
                uint8 tier = subscriptions[i].tier;
                uint256 price = prices[tier];

                IRouter(routerAddress).charge(subscriptions[i].userAccount, address(this), price);
                subscriptions[i].paymentDue = block.timestamp + 30 days;

                uint256 paymentAmount = getPaymentAmount(price);
                if (currentLoan.repaidAmount < currentLoan.repaymentAmount) {
                    IERC20(usde).transfer(currentLoan.investor, paymentAmount);
                    currentLoan.repaidAmount = currentLoan.repaidAmount + paymentAmount;
                }                
            }
        }
    }

    function makeRequest(uint256 loanAmount, uint256 interest, uint256 loanPeriod) external onlyOwner {
        uint256 mrr = getMRR();
        currentLoanRequest.investor = address(0);
        currentLoanRequest.repaymentAmount = ((interest / 100) * loanAmount) + loanAmount;
        currentLoanRequest.repaidAmount = 0;
        currentLoanRequest.loanPeriod = loanPeriod;
        currentLoanRequest.monthlyRepaymentAmount = mrr / loanPeriod;
    }

    function getPaymentAmount(uint256 subPrice) internal view returns(uint256 repaymentAmountPerSub) {
       uint256 mrr = getMRR();
       uint256 rpa = currentLoan.repaymentAmount / currentLoan.loanPeriod;
       uint256 rpp = (rpa / mrr) * 100;

       repaymentAmountPerSub = (rpp / 100) * subPrice;
    }

    function getMRR() public view returns (uint256 mrr) {
        for (uint i = 0; i < _subscriptionCount.current(); i++) {
            if (subscriptions[i].status == true) {
                uint8 tier = subscriptions[i].tier;
                uint256 price = prices[tier];

                mrr = mrr + price;
            }
        }
    }


    modifier onlyRouter() {
        require(msg.sender == routerAddress, "No Permision to Call Function");
        _;
    }
}

// functions
// 1. accept payment/charge ✅
// 2. accept/take loan 
// 3. sevrice loan ✅
// 4. withdraw ✅
// 5. invest USDe
