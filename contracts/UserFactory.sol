// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./userAccount.sol";
import "./MerchantAccount.sol";
import "./InvestorAccount.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UserFactory {

    using Counters for Counters.Counter;
    Counters.Counter public _userCount;

    address public routerAddress;
    address public usde;

    struct user {
        string userName;
        address userAddress;
        string role;
    }

    mapping (address => user) public users;
    mapping (uint256 => user) public userType;

    constructor(address _routerAddress, address usdeAddress) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    function createAccount(string memory userName, uint8 role) external {
        require(users[msg.sender].userAddress == address(0), "Already have an account");
        if (role == 0) {
            UserAccount newUser = new UserAccount(routerAddress, usde, msg.sender);
            users[msg.sender] = user(userName, address(newUser), "user");
            userType[_userCount.current()] = user(userName, address(newUser), "user");
            _userCount.increment();
        } else if (role == 1) {
            MerchantAccount newMerchant = new MerchantAccount(routerAddress, usde, msg.sender);
            users[msg.sender] = user(userName, address(newMerchant), "merchant");
            userType[_userCount.current()] = user(userName, address(newMerchant), "merchant");
            _userCount.increment();
        } else {
            InvestorAccount newInvestor = new InvestorAccount(routerAddress, usde, msg.sender);
            users[msg.sender] = user(userName, address(newInvestor), "investor");
            userType[_userCount.current()] = user(userName, address(newInvestor), "investor");
            _userCount.increment();
        }
    }

    function getAccountAddress(address accountOwner) public view returns(address) {
        return users[accountOwner].userAddress;
    }
}