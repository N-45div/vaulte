// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Interfaces/IRouter.sol";

/**
 * @title InvestorAccount
 * @notice Contract managing investor accounts, loan offers, and loan disbursements
 * @dev Inherits OpenZeppelin's Ownable contract for access control
 */
contract InvestorAccount is Ownable {
    using Counters for Counters.Counter;

    // State variables
    Counters.Counter public _loanCount;   // Changed to private with getter
    Counters.Counter public _offerCount;  // Changed to private with getter
    address public immutable usde;         // Made immutable
    address public immutable routerAddress; // Made immutable

    // Structs with proper naming convention
    struct Loan {  // Capitalized struct name
        address merchant;
        uint256 repaymentAmount;
        uint256 repaidAmount;
        uint256 loanPeriod;
        uint256 monthlyRepaymentAmount;
    }

    struct Offer {  // Capitalized struct name
        address investor;
        uint256 loanAmount;
        uint256 interest;
        uint256 repaidAmount;
        uint256 loanPeriod;
        uint256 monthlyRepaymentAmount;
    }

    // Public mappings
    mapping(uint256 => Offer) public offers;
    mapping(uint256 => Loan) public loans;

    // Events for better tracking
    event OfferCreated(uint256 indexed offerId, uint256 loanAmount, uint256 interest, uint256 loanPeriod);
    event LoanDisbursed(uint256 indexed loanId, address merchant, uint256 amount);
    event RequestAccepted(uint256 indexed loanId, address merchant, uint256 amount);
    event PoolContribution(address indexed pool, uint256 amount);

    /**
     * @notice Contract constructor
     * @param _routerAddress Address of the router contract
     * @param usdeAddress Address of the USDE token contract
     * @param owner Address of the contract owner
     */
    constructor(
        address _routerAddress,
        address usdeAddress,
        address owner
    ) Ownable(owner) {
        require(_routerAddress != address(0), "Invalid router address");
        require(usdeAddress != address(0), "Invalid USDE address");
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    /**
     * @notice Allows owner to withdraw tokens from the contract
     * @param amount Amount of tokens to withdraw
     * @param tokenAddress Address of the token to withdraw
     */
    function withdraw(uint256 amount, address tokenAddress) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(tokenAddress != address(0), "Invalid token address");
        require(IERC20(tokenAddress).transfer(msg.sender, amount), "Transfer failed");
    }

    /**
     * @notice Creates a new loan offer
     * @param loanAmount Amount of the loan
     * @param interest Interest rate in percentage
     * @param loanPeriod Duration of the loan in months
     */
    function makeOffer(
        uint256 loanAmount,
        uint256 interest,
        uint256 loanPeriod
    ) external onlyOwner {
        require(loanAmount > 0, "Invalid loan amount");
        require(loanPeriod > 0, "Invalid loan period");
        
        uint256 offerId = _offerCount.current();
        offers[offerId] = Offer({
            investor: address(this),
            loanAmount: loanAmount,
            interest: interest,
            repaidAmount: 0,
            loanPeriod: loanPeriod,
            monthlyRepaymentAmount: loanAmount / loanPeriod
        });
        
        emit OfferCreated(offerId, loanAmount, interest, loanPeriod);
        _offerCount.increment();
    }

    /**
     * @notice Disburses a loan offer to a merchant
     * @param merchant Address of the merchant receiving the loan
     * @param offerId ID of the offer being disbursed
     * @dev Transfers funds through router and creates a new loan entry
     */
    function disburseLoanOffer(address merchant, uint256 offerId) external onlyRouter {
        // Input validation
        require(merchant != address(0), "Invalid merchant address");
        require(offers[offerId].loanAmount > 0, "Invalid offer");

        Offer memory offer = offers[offerId];
        uint256 currentLoanId = _loanCount.current();
        uint256 totalRepayment = offer.loanAmount + ((offer.interest * offer.loanAmount) / 100);

        // Create new loan entry
        loans[currentLoanId] = Loan({
            merchant: merchant,
            repaymentAmount: totalRepayment,
            repaidAmount: 0,
            loanPeriod: offer.loanPeriod,
            monthlyRepaymentAmount: offer.monthlyRepaymentAmount
        });

        IERC20(usde).transfer(merchant, offer.loanAmount);
        
        emit LoanDisbursed(currentLoanId, merchant, offer.loanAmount);
        _loanCount.increment();
    }

    /**
     * @notice Accepts a loan request from a merchant through the router
     * @param merchant Address of the merchant requesting the loan
     * @param loanAmount Principal amount of the loan
     * @param interest Interest rate in percentage (e.g., 5 for 5%)
     * @param loanPeriod Duration of the loan in months
     * @param monthlyRepaymentAmount Amount to be repaid each month
     * @dev Validates inputs, creates a loan record, and transfers funds
     * @dev Only callable by the router contract
     */
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
        
        // Calculate loan details
        uint256 currentLoanId = _loanCount.current();
        uint256 totalRepayment = calculateTotalRepayment(loanAmount, interest);

        // Create new loan
        loans[currentLoanId] = Loan({
            merchant: merchant,
            repaymentAmount: totalRepayment,
            repaidAmount: 0,
            loanPeriod: loanPeriod,
            monthlyRepaymentAmount: monthlyRepaymentAmount
        });

        // Transfer funds and emit event
        require(IERC20(usde).transfer(merchant, loanAmount), "Transfer failed");
        emit RequestAccepted(currentLoanId, merchant, loanAmount);
        
        _loanCount.increment();
    }

    /**
     * @notice Calculates the total repayment amount including interest
     * @param principal The initial loan amount
     * @param interestRate The interest rate in percentage
     * @return The total amount to be repaid
     */
    function calculateTotalRepayment(uint256 principal, uint256 interestRate) 
        internal 
        pure 
        returns (uint256) 
    {
        return principal + ((interestRate * principal) / 100);
    }

    
    /**
     * @notice Contributes USDE tokens to a specified pool
     * @param pool Address of the pool to contribute to
     * @param amount Amount of USDE tokens to contribute
     * @dev Only callable by the router contract
     * @dev Transfers USDE tokens directly from this contract to the pool
     */
    function contributePool(address pool, uint256 amount) external onlyRouter() {
        IERC20(usde).transfer(pool, amount);
    }

    /**
     * @notice Returns the current loan count
     */
    function getLoanCount() external view returns (uint256) {
        return _loanCount.current();
    }

    /**
     * @notice Returns the current offer count
     */
    function getOfferCount() external view returns (uint256) {
        return _offerCount.current();
    }

    modifier onlyRouter() {
        require(msg.sender == routerAddress, "Caller is not the router");
        _;
    }
}