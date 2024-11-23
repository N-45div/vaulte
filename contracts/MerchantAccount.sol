// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Interfaces/IRouter.sol";

contract MerchantAccount is Ownable {

    /**
     * @notice Utilizing OpenZeppelin's Counters library for managing counters, which includes functions like increment, decrement, and reset.
     */
    using Counters for Counters.Counter;

    /**
     * @notice Counter for tracking the number of subscriptions.
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

    struct loanRequest {
        address investor;
        uint256 loanAmount;
        uint256 interest;
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
    loanRequest public currentLoanRequest;

    mapping (uint256 => subscription) public subscriptions;
    mapping (uint8 => uint256) public prices;

    // Add events for important state changes
    event LoanRequested(uint256 amount, uint256 interest, uint256 period);
    event LoanReceived(address investor, uint256 amount);
    event SubscriptionCharged(address user, uint256 amount);
    event LoanRepayment(address investor, uint256 amount);

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

        _subscriptionCount.increment();
    }

    // function to be automated
    function chargeSubscription() external {
        for (uint i = 0; i < _subscriptionCount.current(); i++) {
            if (subscriptions[i].paymentDue <= block.timestamp && subscriptions[i].status) {
                uint8 tier = subscriptions[i].tier;
                uint256 price = prices[tier];

                IRouter(routerAddress).charge(subscriptions[i].userAccount, address(this), price);
                subscriptions[i].paymentDue = block.timestamp + 30 days;

                uint256 paymentAmount = getPaymentAmount(price);
                if (currentLoan.repaidAmount < currentLoan.repaymentAmount) {
                    IERC20(usde).transfer(currentLoan.investor, paymentAmount);
                    currentLoan.repaidAmount = currentLoan.repaidAmount + paymentAmount;
                    emit LoanRepayment(currentLoan.investor, paymentAmount);
                }
                emit SubscriptionCharged(subscriptions[i].userAccount, price);           
            }
        }
    }

    function makeRequest(uint256 loanAmount, uint256 interest, uint256 loanPeriod) external onlyOwner {
        // Input validation
        require(loanAmount > 0, "Loan amount must be greater than 0");
        require(loanPeriod > 0, "Loan period must be greater than 0");
        require(interest <= 10, "Interest rate must be less than or equal to 10");
        
        // Calculate total repayment amount (principal + interest)
        uint256 interestAmount = (loanAmount * interest) / 100;
        uint256 totalRepayment = loanAmount + interestAmount;
        
        currentLoanRequest = loanRequest({
            investor: address(0),
            loanAmount: loanAmount,
            interest: interest,
            repaymentAmount: totalRepayment,
            repaidAmount: 0,
            loanPeriod: loanPeriod,
            monthlyRepaymentAmount: totalRepayment / loanPeriod
        });
    }

    /**
     * @notice Finalizes a loan request by setting up the current loan with an investor
     * @dev Can only be called by the router contract
     * @param investor The address of the investor funding the loan
     */
    function receiveLoan(address investor) external onlyRouter {
        // Ensure there isn't already an active loan
        require(currentLoan.investor == address(0), "Merchant already has an ongoing loan");

        // Set up the new loan using parameters from the current loan request
        currentLoan.investor = investor;                                           // Store investor's address
        currentLoan.repaymentAmount = currentLoanRequest.repaymentAmount;         // Total amount to be repaid (principal + interest)
        currentLoan.repaidAmount = 0;                                             // Initialize repaid amount to 0
        currentLoan.loanPeriod = currentLoanRequest.loanPeriod;                   // Duration of the loan in months
        currentLoan.monthlyRepaymentAmount = currentLoanRequest.monthlyRepaymentAmount;  // Monthly payment amount

        // Emit event to log the loan creation
        emit LoanReceived(investor, currentLoanRequest.loanAmount);
    }

    /**
     * @notice Sets up a new loan for the merchant
     * @dev Can only be called by the router contract
     * @param investor The address of the investor funding the loan
     * @param repaymentAmount Total amount to be repaid including interest
     * @param loanPeriod Duration of the loan in months
     * @param monthlyRepaymentAmount Amount to be repaid each month
     */
    function getLoan(address investor, uint256 repaymentAmount, uint256 loanPeriod, uint256 monthlyRepaymentAmount) external onlyRouter() {
        // Ensure there isn't already an active loan
        require(currentLoan.investor == address(0), "Merchant already has an ongoing laon");

        // Initialize the loan parameters
        currentLoan.investor = investor;                    // Set the investor's address
        currentLoan.repaymentAmount = repaymentAmount;     // Set total amount to be repaid
        currentLoan.repaidAmount = 0;                      // Initialize repaid amount to 0
        currentLoan.loanPeriod = loanPeriod;              // Set the loan duration
        currentLoan.monthlyRepaymentAmount = monthlyRepaymentAmount;  // Set monthly payment amount
    }

    /**
     * @notice Allows the merchant to repay the entire remaining loan balance
     * @dev Only callable by the contract owner (merchant)
     * @custom:throws "Loan has been repaid" if the loan is already fully repaid
     */
    function repayLoan() external onlyOwner {
        require(currentLoan.repaymentAmount > currentLoan.repaidAmount, "Loan has been repaid");
        uint256 amount = currentLoan.repaymentAmount - currentLoan.repaidAmount;
        IERC20(usde).transfer(currentLoan.investor, amount);
    }

    /**
     * @notice Calculates the repayment amount for a specific subscription price
     * @dev Uses the Monthly Recurring Revenue (MRR) to determine proportional repayment
     * @param subPrice The price of the subscription tier
     * @return repaymentAmountPerSub The amount that should be repaid from this subscription
     * @custom:throws "No active subscriptions" if MRR is 0
     * @custom:throws "Invalid loan period" if loan period is not set
     */
    function getPaymentAmount(uint256 subPrice) public view returns(uint256 repaymentAmountPerSub) {
       uint256 mrr = getMRR();
       require(mrr > 0, "No active subscriptions");
       require(currentLoan.loanPeriod > 0, "Invalid loan period");
       
       uint256 rpa = currentLoan.repaymentAmount / currentLoan.loanPeriod;
       uint256 rpp = (rpa * 100) / mrr;

       repaymentAmountPerSub = (rpp * subPrice) / 100;
    }

    /**
     * @notice Calculates the total Monthly Recurring Revenue (MRR) from all active subscriptions
     * @dev Iterates through all subscriptions and sums up the prices of active ones
     * @return mrr The total monthly recurring revenue
     */
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
