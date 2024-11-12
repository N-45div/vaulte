// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IRouter.sol";

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

    mapping (uint256 => loan) public loans;
    mapping (uint256 => offer) public offers;

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

        IERC20(usde).transfer(routerAddress, offers[offerId].loanAmount);
        _loanCount.increment();
    }

    function acceptRequest(address merchant, uint256 loanAmount, uint256 interest, uint256 loanPeriod, uint256 monthlyRepaymentAmount) external onlyRouter() {
        loans[_loanCount.current()].merchant = merchant;
        loans[_loanCount.current()].repaymentAmount = ((interest / 100) * loanAmount) + loanAmount;
        loans[_loanCount.current()].repaidAmount = 0;
        loans[_loanCount.current()].loanPeriod = loanPeriod;
        loans[_loanCount.current()].monthlyRepaymentAmount = monthlyRepaymentAmount;

        IERC20(usde).transfer(routerAddress, loanAmount);
        _loanCount.increment();
    }

    modifier onlyRouter() {
        require(msg.sender == routerAddress, "No Permision to Call Function");
        _;
    }
}

// functions
// 1. offer/give loan ✅
// 2. withdraw ✅
// 3. invest USDe(15%)