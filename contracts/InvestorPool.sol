// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Interfaces/IRouter.sol";

contract InvestorPool is Ownable {
    /**
     * @notice Utilizing OpenZeppelin's Counters library for managing counters, which includes functions like increment, decrement, and reset.
     */
    using Counters for Counters.Counter;

    /**
     * @notice Counter for tracking the number of subscribtions.
     */
    Counters.Counter public _loanCount;

    address public usde;
    address public routerAddress;

    uint256 public interest;
    uint256 public loanPeriod;
    uint256 public investmentAmount;

    struct loan {
        address merchant;
        uint256 repaymentAmount;
        uint256 repaidAmount;
        uint256 loanPeriod;
        uint256 monthlyRepaymentAmount;
    }

    mapping (uint256 => loan) public loans;
    mapping (address => uint256) public investors;

    constructor(address _routerAddress, address usdeAddress, address owner, uint256 _interest, uint256 _loanPeriod) Ownable(owner) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
        interest = _interest;
        loanPeriod = _loanPeriod;
    }

    /**
     * @notice Allows an investor to contribute funds to the pool
     * @param investorAccount The address of the investor
     * @param amount The amount of USDE tokens to contribute
     * @dev Only callable by the router contract
     */
    function contribute(address investorAccount, uint256 amount) external onlyRouter() {
        require(amount > 0, "Amount must be greater than 0");
        investors[investorAccount] = amount;
        investmentAmount = investmentAmount + amount;
    }

    /**
     * @notice Allows an investor to redeem their investment plus any earned returns
     * @param investorAccount The address of the investor redeeming funds
     * @dev Calculates payout based on investor's percentage ownership of the pool
     */
    function redeem(address investorAccount) external {
        uint256 investorAmount = investors[investorAccount];
        require(investorAmount > 0, "No investment found");
        
        uint256 poolBalance = IERC20(usde).balanceOf(address(this));
        // Using fixed-point arithmetic to avoid precision loss
        uint256 investorPercentage = (investorAmount * 1e18) / investmentAmount;
        uint256 payoutAmount = (poolBalance * investorPercentage) / 1e18;

        investors[investorAccount] = 0; // Reset investment amount
        investmentAmount = investmentAmount - investorAmount;
        
        require(IERC20(usde).transfer(investorAccount, payoutAmount), "Transfer failed");
    }

    /**
     * @notice Allows a merchant to take out a loan from the pool
     * @param merchantAccount The address of the merchant
     * @param amount The amount of USDE tokens to borrow
     * @param loanPeriod_ The duration of the loan in months
     * @dev Only callable by the router contract
     */
    function getLoan(address merchantAccount, uint256 amount, uint256 loanPeriod_) external onlyRouter() {
        require(amount > 0, "Amount must be greater than 0");
        require(investmentAmount > 0, "Pool has no funds");
        
        uint256 amountPercentage = (amount * 100) / investmentAmount;
        require(amountPercentage <= 10, "Amount too high");
        require(loanPeriod_ <= loanPeriod, "max repayment period exceeded");

        uint256 repaymentAmount = amount + ((interest * amount) / 100);
        uint256 monthlyRepaymentAmount = repaymentAmount / loanPeriod_;
        
        uint256 loanId = _loanCount.current();
        loans[loanId] = loan(
            merchantAccount,
            repaymentAmount,
            0,
            loanPeriod_,
            monthlyRepaymentAmount
        );
        _loanCount.increment();

        require(IERC20(usde).transfer(merchantAccount, amount), "Transfer failed");
    }

    modifier onlyRouter() {
        require(msg.sender == routerAddress, "No Permision to Call Function");
        _;
    }
}