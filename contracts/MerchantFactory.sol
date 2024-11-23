// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./MerchantAccount.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MerchantFactory {
    using Counters for Counters.Counter;
    Counters.Counter public _merchantCount;

    address public routerAddress;
    address public usde;

    struct merchant {
        string merchantName;
        address merchantAddress;
    }

    mapping (address => merchant) public merchants;
    mapping (uint256 => merchant) public merchantType;

    constructor(address _routerAddress, address usdeAddress) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    function createAccount(string memory merchantName) external {
        require(merchants[msg.sender].merchantAddress == address(0), "Already have an account");
        
        MerchantAccount newMerchant = new MerchantAccount(routerAddress, usde, msg.sender);
        merchants[msg.sender] = merchant(merchantName, address(newMerchant));
        merchantType[_merchantCount.current()] = merchant(merchantName, address(newMerchant));
        _merchantCount.increment();
    }

    function getAccountAddress(address merchantAddress) public view returns(address) {
        return merchants[merchantAddress].merchantAddress;
    }
} 