// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./InvestorAccount.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title InvestorFactory
/// @notice Factory contract for creating and managing investor accounts
contract InvestorFactory {

    // Use OpenZeppelin's Counter for tracking number of users
    using Counters for Counters.Counter;
    Counters.Counter public _userCount;

    // Contract addresses for router and USDE token
    address public routerAddress;
    address public usde;

    /// @notice Structure to store investor details
    struct investor {
        string investorName;
        address investorAddress;  // Address of the deployed InvestorAccount contract
    }

    // Mapping from user's EOA address to their investor details
    mapping (address => investor) public investors;
    // Mapping from user ID to their investor details (allows enumeration)
    mapping (uint256 => investor) public investorType;

    /// @notice Initializes the factory with required contract addresses
    /// @param _routerAddress Address of the router contract
    /// @param usdeAddress Address of the USDE token contract
    constructor(address _routerAddress, address usdeAddress) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    /// @notice Creates a new investor account
    /// @param investorName Name of the investor
    /// @dev Deploys a new InvestorAccount contract and stores the mapping
    function createAccount(string memory investorName) external {
        require(investors[msg.sender].investorAddress == address(0), "Already have an account");
        
        InvestorAccount newInvestor = new InvestorAccount(routerAddress, usde, msg.sender);
        investors[msg.sender] = investor(investorName, address(newInvestor));
        investorType[_userCount.current()] = investor(investorName, address(newInvestor));
        _userCount.increment();
    }

    /// @notice Retrieves the InvestorAccount contract address for a given investor
    /// @param investorAddress The EOA address of the investor
    /// @return The address of the investor's InvestorAccount contract
    function getAccountAddress(address investorAddress) public view returns(address) {
        return investors[investorAddress].investorAddress;
    }
}