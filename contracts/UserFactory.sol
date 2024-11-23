// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./userAccount.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UserFactory {

    using Counters for Counters.Counter;
    Counters.Counter public _userCount;

    address public routerAddress;
    address public usde;

    struct user {
        string userName;
        address userAddress;
    }

    mapping (address => user) public users;
    mapping (uint256 => user) public userType;

    constructor(address _routerAddress, address usdeAddress) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    function createAccount(string memory userName) external {
        require(users[msg.sender].userAddress == address(0), "Already have an account");
        UserAccount newUser = new UserAccount(routerAddress, usde, msg.sender);
        users[msg.sender] = user(userName, address(newUser));
        userType[_userCount.current()] = user(userName, address(newUser));
        _userCount.increment();
    }

    function getAccountAddress(address accountOwner) public view returns(address) {
        return users[accountOwner].userAddress;
    }
}