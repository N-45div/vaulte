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

    function contribute(address investorAccount, uint256 amount) external onlyRouter() {
        investors[investorAccount] = amount;
    }

    function redeem(address investorAccount) external onlyRouter() {
        uint256 poolBalance = IERC20(usde).balanceOf(address(this));
        uint256 investorPercentage = (investors[investorAccount] / investmentAmount) * 100;
        uint256 payoutAmount = (investorPercentage / 100) * poolBalance;

        investmentAmount = investmentAmount - investors[investorAccount];
        IERC20(usde).transfer(investorAccount, payoutAmount);
    }

    function getLoan(address merchantAccount, uint256 amount, uint256 loanPeriod_) external onlyRouter() {
        // uint256 poolBalance = IERC20(usde).balanceOf(address(this));
        uint256 amountPercentage = (amount / investmentAmount) * 100;
        require(amountPercentage <= 10, "Amount too high");
        require(loanPeriod_ <= loanPeriod, "max repayment period exceeded");
        uint256 repaymentAmount = ((interest / 100) * amount) + amount;
        uint256 monthlyRepaymentAmount = repaymentAmount / loanPeriod_;
        loans[_loanCount.current()] = loan(merchantAccount, repaymentAmount, 0, loanPeriod_, monthlyRepaymentAmount);

        IERC20(usde).transfer(merchantAccount, amount);
    }

    modifier onlyRouter() {
        require(msg.sender == routerAddress, "No Permision to Call Function");
        _;
    }
}