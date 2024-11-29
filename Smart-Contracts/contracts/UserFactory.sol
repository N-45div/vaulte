// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./userAccount.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title UserFactory - A factory contract for creating user accounts
/// @notice This contract manages the creation and tracking of user accounts
contract UserFactory {

    using Counters for Counters.Counter;
    /// @notice Counter to track the total number of users
    Counters.Counter public _userCount;

    /// @notice Address of the router contract used for user account operations
    address public routerAddress;
    /// @notice Address of the USDE token contract
    address public usde;

    /// @notice Structure to store user information
    /// @param userName The display name of the user
    /// @param userAddress The address of the user's account contract
    struct user {
        string userName;
        address userAddress;
    }

    /// @notice Mapping from user's EOA address to their user information
    mapping (address => user) public users;
    /// @notice Mapping from user ID to their user information
    mapping (uint256 => user) public userType;

    /// @notice Initializes the UserFactory contract
    /// @param _routerAddress Address of the router contract
    /// @param usdeAddress Address of the USDE token contract
    constructor(address _routerAddress, address usdeAddress) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    /// @notice Creates a new user account
    /// @dev Deploys a new UserAccount contract and stores the user information
    /// @param userName The display name for the new user
    function createAccount(string memory userName) external {
        require(users[msg.sender].userAddress == address(0), "Already have an account");
        UserAccount newUser = new UserAccount(routerAddress, usde, msg.sender);
        users[msg.sender] = user(userName, address(newUser));
        userType[_userCount.current()] = user(userName, address(newUser));
        _userCount.increment();
    }

    /// @notice Retrieves the account contract address for a given user
    /// @param accountOwner The EOA address of the account owner
    /// @return The address of the user's account contract
    function getAccountAddress(address accountOwner) public view returns(address) {
        return users[accountOwner].userAddress;
    }
}