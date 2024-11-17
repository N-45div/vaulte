// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./userAccount.sol";
import "./MerchantAccount.sol";
import "./InvestorAccount.sol";
contract UserFactory is Ownable {

    address public routerAddress;
    address public usde;

    struct user {
        string userName;
        address userAddress;
        string role;
    }

    mapping (address => user) public users;

    constructor(address _routerAddress, address usdeAddress) Ownable(msg.sender) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    function createAccount(string memory userName, uint8 role) external {
        require(users[msg.sender].userAddress == address(0), "Already have an account");
        if (role == 0) {
            UserAccount newUser = new UserAccount(routerAddress, usde, msg.sender);
            users[msg.sender].userName = userName;
            users[msg.sender].userAddress = address(newUser);
            users[msg.sender].role = "user";
        } else if (role == 1) {
            MerchantAccount newMerchant = new MerchantAccount(routerAddress, usde, msg.sender);
            users[msg.sender].userName = userName;
            users[msg.sender].userAddress = address(newMerchant);
            users[msg.sender].role = "merchant";
        } else {
            InvestorAccount newInvestor = new InvestorAccount(routerAddress, usde, msg.sender);
            users[msg.sender].userName = userName;
            users[msg.sender].userAddress = address(newInvestor);
            users[msg.sender].role = "investor";
        }
    }

    function getAccountAddress(address accountOwner) public view returns(address) {
        return users[accountOwner].userAddress;
    }
}