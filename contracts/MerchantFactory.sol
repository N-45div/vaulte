// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./MerchantAccount.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title MerchantFactory
/// @notice Factory contract for creating and managing merchant accounts
/// @dev Handles the creation and tracking of MerchantAccount contracts
contract MerchantFactory {
    using Counters for Counters.Counter;
    /// @notice Total number of merchants created
    Counters.Counter public _merchantCount;

    /// @notice Address of the router contract
    address public routerAddress;
    /// @notice Address of the USDE token contract
    address public usde;

    /// @notice Structure to store merchant information
    /// @param merchantName Name of the merchant
    /// @param merchantAddress Address of the merchant's account contract
    struct merchant {
        string merchantName;
        address merchantAddress;
    }

    /// @notice Mapping from merchant's EOA to their merchant information
    mapping (address => merchant) public merchants;
    /// @notice Mapping from merchant ID to their merchant information
    mapping (uint256 => merchant) public merchantType;

    /// @notice Initializes the factory with required contract addresses
    /// @param _routerAddress Address of the router contract
    /// @param usdeAddress Address of the USDE token contract
    constructor(address _routerAddress, address usdeAddress) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    /// @notice Creates a new merchant account
    /// @dev Deploys a new MerchantAccount contract and stores the merchant information
    /// @param merchantName Name of the merchant
    function createAccount(string memory merchantName) external {
        require(merchants[msg.sender].merchantAddress == address(0), "Already have an account");
        
        MerchantAccount newMerchant = new MerchantAccount(routerAddress, usde, msg.sender);
        merchants[msg.sender] = merchant(merchantName, address(newMerchant));
        merchantType[_merchantCount.current()] = merchant(merchantName, address(newMerchant));
        _merchantCount.increment();
    }

    /// @notice Retrieves the merchant account contract address for a given merchant
    /// @param merchantAddress Address of the merchant's EOA
    /// @return Address of the merchant's account contract
    function getAccountAddress(address merchantAddress) public view returns(address) {
        return merchants[merchantAddress].merchantAddress;
    }
} 