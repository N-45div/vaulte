// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MerchantAccount is Ownable{

    /**
     * @notice Utilizing OpenZeppelin's Counters library for managing counters, which includes functions like increment, decrement, and reset.
     */
    using Counters for Counters.Counter;

    /**
     * @notice Counter for tracking the number of subscribtions.
     */
    Counters.Counter public _subscriptionCount;

    uint256 public freeTrial;
    address public usde;
    address public routerAddress;
    
    struct subscription {
        address userAccount;
        uint256 paymentDue;
        bool status;
        uint8 tier;
    }

    mapping (uint256 => subscription) public subscriptions;
    mapping (uint8 => uint256) public prices;

    constructor(address _routerAddress, address usdeAddress, address owner) Ownable(owner) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    function getPrice(uint8 tier) public view returns(uint256) {
        return prices[tier];
    }

    function setPrice(uint8 tier, uint256 price) public onlyOwner() {
        prices[tier] = price;
    }

    function setFreeTrial(uint256 trialPeriod) public onlyOwner() {
        freeTrial = trialPeriod;
    }

    function withdraw(uint256 amount, address tokenAddress) public onlyOwner {
        IERC20(tokenAddress).transfer(msg.sender, amount);
    }

    function setSubscription(uint8 tier, uint256 paymentDue, address userAccount) external onlyRouter() {
        subscriptions[_subscriptionCount.current()].userAccount = userAccount;
        subscriptions[_subscriptionCount.current()].paymentDue = paymentDue;
        subscriptions[_subscriptionCount.current()].tier = tier;
        subscriptions[_subscriptionCount.current()].status = true;
    }

    // function to be automated 
    function chargeSubscription() external {
        // charge user
            // call charge function
            // 
        // check for active loans
        // calculate percentages based on MRR and loan amount and remaining debt
        // payout to the investor 
    }

    function getAddresses() internal returns(address[] users) {
        for(i = 0, i < _subscriptionCount, i++) {
            
        }
    }

    modifier onlyRouter() {
        require(msg.sender == routerAddress, "No Permision to Call Function");
        _;
    }
}

// functions
// 1. accept payment/charge 
// 2. accept/take loan 
// 3. sevrice loan 
// 4. withdraw ✅
// 5. invest USDe
// 6. convert
