// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./InvestorAccount.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract InvestorFactory {

    using Counters for Counters.Counter;
    Counters.Counter public _userCount;

    address public routerAddress;
    address public usde;

    struct investor {
        string investorName;
        address investorAddress;
    }

    mapping (address => investor) public investors;
    mapping (uint256 => investor) public investorType;

    constructor(address _routerAddress, address usdeAddress) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    function createAccount(string memory investorName) external {
        require(investors[msg.sender].investorAddress == address(0), "Already have an account");
        
        InvestorAccount newInvestor = new InvestorAccount(routerAddress, usde, msg.sender);
        investors[msg.sender] = investor(investorName, address(newInvestor));
        investorType[_userCount.current()] = investor(investorName, address(newInvestor));
        _userCount.increment();
    }

    function getAccountAddress(address investorAddress) public view returns(address) {
        return investors[investorAddress].investorAddress;
    }
}