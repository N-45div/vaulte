// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IMerchant.sol";

contract UserAccount is Ownable{
    /**
     * @notice Utilizing OpenZeppelin's Counters library for managing counters, which includes functions like increment, decrement, and reset.
     */
    using Counters for Counters.Counter;

    /**
     * @notice Counter for tracking the number of services subscribed to.
     */
    Counters.Counter public _subscriptionCount;

    address public usde;
    address public routerAddress;

    struct subscription {
        address merchantAddress;
        uint8 tier;
        bool status;
    }

    mapping (uint256 => subscription) public userSubscriptions;

    constructor(address _routerAddress, address usdeAddress, address owner) Ownable(owner) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    function withdraw(uint256 amount, address tokenAddress) public onlyOwner {
        IERC20(tokenAddress).transfer(msg.sender, amount);
    }

    function subscribe(uint8 tier, uint256 paymentDue, address merchantAddress) external onlyRouter() {
        userSubscriptions[_subscriptionCount.current()].merchantAddress = merchantAddress;
        userSubscriptions[_subscriptionCount.current()].tier = tier;
        userSubscriptions[_subscriptionCount.current()].status = true;

        if (paymentDue >= block.timestamp) {
            uint256 price = IMerchant(merchantAddress).getPrice(tier);
            IERC20(usde).transfer(merchantAddress, price);
        }
    }

    function paySubscription(uint256 amount, address tokenAddress, address merchantAddress) public onlyRouter() {
        
        IERC20(tokenAddress).transfer(merchantAddress, amount);
    }

    modifier onlyRouter() {
        require(msg.sender == routerAddress, "No Permision to Call Function");
        _;
    }
    

}