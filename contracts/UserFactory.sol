// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./userAccount.sol";

contract UserAccountFactory is Ownable {

    /**
     * @notice Utilizing OpenZeppelin's Counters library for managing counters, which includes functions like increment, decrement, and reset.
     */
    using Counters for Counters.Counter;

    /**
     * @notice Counter for tracking the number of users.
     */
    Counters.Counter public userCount;

    address public routerAddress;
    address public usde;

    struct user {
        string userName;
        address userAddress;
    }

    mapping (address => user) public users;

    constructor(address _routerAddress, address usdeAddress) Ownable(msg.sender) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    function createAccount(string memory userName) public {
        require(users[msg.sender].userAddress == address(0), "Already have an account");
        UserAccount newUser = new UserAccount(routerAddress, usde, msg.sender);
        users[msg.sender].userName = userName;
        users[msg.sender].userAddress = address(newUser);
    }

    function getAccountAddress(address accountOwner) public view returns(address) {
        return users[accountOwner].userAddress;
    }
}