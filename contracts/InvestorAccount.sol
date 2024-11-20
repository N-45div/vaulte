// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Interfaces/IRouter.sol";

contract InvestorAccount is Ownable{

    /**
     * @notice Utilizing OpenZeppelin's Counters library for managing counters, which includes functions like increment, decrement, and reset.
     */
    using Counters for Counters.Counter;

    /**
     * @notice Counter for tracking the number of subscribtions.
     */
    Counters.Counter public _loanCount;

    Counters.Counter public _offerCount;

    address public usde;
    address public routerAddress;

    struct loan {
        address merchant;
        uint256 repaymentAmount;
        uint256 repaidAmount;
        uint256 loanPeriod;
        uint256 monthlyRepaymentAmount;
    }

    struct offer {
        address investor;
        uint256 loanAmount;
        uint256 interest;
        uint256 repaidAmount;
        uint256 loanPeriod;
        uint256 monthlyRepaymentAmount;
    }

    mapping (uint256 => offer) public offers;
    mapping (uint256 => loan) public loans;

    constructor(address _routerAddress, address usdeAddress, address owner) Ownable(owner) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    function withdraw(uint256 amount, address tokenAddress) public onlyOwner {
        IERC20(tokenAddress).transfer(msg.sender, amount);
    }

    function makeOffer(uint256 loanAmount, uint256 interest, uint256 loanPeriod) external onlyOwner {
        offers[_offerCount.current()].investor = address(this);
        offers[_offerCount.current()].loanAmount = loanAmount;
        offers[_offerCount.current()].interest = interest;
        offers[_offerCount.current()].repaidAmount = 0;
        offers[_offerCount.current()].loanPeriod = loanPeriod;
        offers[_offerCount.current()].monthlyRepaymentAmount = loanAmount / loanPeriod;
        _offerCount.increment();
    }

    function disburseLoanOffer(address merchant, uint256 offerId) external onlyRouter {
        IERC20(usde).transfer(routerAddress, offers[offerId].loanAmount);

        loans[_loanCount.current()].merchant = merchant;
        loans[_loanCount.current()].repaymentAmount = ((offers[offerId].interest / 100) * offers[offerId].loanAmount) + offers[offerId].loanAmount;
        loans[_loanCount.current()].repaidAmount = 0;
        loans[_loanCount.current()].loanPeriod = offers[offerId].loanPeriod;
        loans[_loanCount.current()].monthlyRepaymentAmount = offers[offerId].monthlyRepaymentAmount;

        IERC20(usde).transfer(merchant, offers[offerId].loanAmount);
        _loanCount.increment();
    }

    function acceptRequest(
        address merchant,
        uint256 loanAmount,
        uint256 interest,
        uint256 loanPeriod,
        uint256 monthlyRepaymentAmount
    ) external onlyRouter {
        // Input validation
        require(merchant != address(0), "Invalid merchant address");
        require(loanAmount > 0, "Loan amount must be positive");
        require(loanPeriod > 0, "Loan period must be positive");
        require(monthlyRepaymentAmount > 0, "Monthly repayment must be positive");
        
        uint256 currentLoanId = _loanCount.current();
        uint256 totalRepayment = loanAmount + ((interest * loanAmount) / 100);

        // Create new loan
        loans[currentLoanId] = loan({
            merchant: merchant,
            repaymentAmount: totalRepayment,
            repaidAmount: 0,
            loanPeriod: loanPeriod,
            monthlyRepaymentAmount: monthlyRepaymentAmount
        });

        // Transfer funds and increment counter
        IERC20(usde).transfer(routerAddress, loanAmount);
        _loanCount.increment();
    }

    function contributePool(address pool, uint256 amount) external onlyRouter() {
        IERC20(usde).transfer(pool, amount);
    }

    modifier onlyRouter() {
        require(msg.sender == routerAddress, "No Permision to Call Function");
        _;
    }
}