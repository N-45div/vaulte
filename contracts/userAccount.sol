// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Interfaces/IMerchant.sol";

contract UserAccount is Ownable{
    /**
     * @notice Utilizing OpenZeppelin's Counters library for managing counters, which includes functions like increment, decrement, and reset.
     */
    using Counters for Counters.Counter;

    /**
     * @notice Counter for tracking the number of services subscribed to.
     */
    Counters.Counter public _subscriptionCount;

    /// @notice Address of the USDE token contract
    address public usde;
    /// @notice Address of the router contract that manages subscriptions
    address public routerAddress;

    /// @notice Structure defining a subscription's properties
    /// @param merchantAddress Address of the merchant providing the service
    /// @param tier Subscription tier level
    /// @param status Whether the subscription is active
    struct subscription {
        address merchantAddress;
        uint8 tier;
        bool status;
    }

    /// @notice Mapping of subscription ID to subscription details
    mapping (uint256 => subscription) public userSubscriptions;

    /// @notice Initializes the contract with router and token addresses
    /// @param _routerAddress Address of the subscription router
    /// @param usdeAddress Address of the USDE token
    /// @param owner Address of the account owner
    constructor(address _routerAddress, address usdeAddress, address owner) Ownable(owner) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    /// @notice Allows owner to withdraw tokens from the contract
    /// @param amount Amount of tokens to withdraw
    /// @param tokenAddress Address of the token to withdraw
    function withdraw(uint256 amount, address tokenAddress) public onlyOwner {
        IERC20(tokenAddress).transfer(msg.sender, amount);
    }

    /// @notice Creates a new subscription to a merchant's service
    /// @param tier Subscription tier level
    /// @param paymentDue Timestamp when payment is due
    /// @param merchantAddress Address of the merchant to subscribe to
    function subscribe(uint8 tier, uint256 paymentDue, address merchantAddress) external onlyRouter() {
        userSubscriptions[_subscriptionCount.current()].merchantAddress = merchantAddress;
        userSubscriptions[_subscriptionCount.current()].tier = tier;
        userSubscriptions[_subscriptionCount.current()].status = true;

        if (paymentDue <= block.timestamp) {
            uint256 price = IMerchant(merchantAddress).getPrice(tier);
            IERC20(usde).transfer(merchantAddress, price);
        }
    }

    /// @notice Cancels an active subscription
    /// @param merchantAddress Address of the merchant to unsubscribe from
    function unsubscribe(address merchantAddress) external onlyOwner() {
        for (uint256 i = 0; i < _subscriptionCount.current(); i++) {
            if (userSubscriptions[i].merchantAddress == merchantAddress) {
                userSubscriptions[i].status = false;
                break;
            }
        }
    }

    /// @notice Processes a subscription payment
    /// @param amount Amount to pay for the subscription
    /// @param merchantAddress Address of the merchant to pay
    function paySubscription(uint256 amount, address merchantAddress) external onlyRouter() {
        for (uint i = 0; i < _subscriptionCount.current(); i++) {
            if (userSubscriptions[i].merchantAddress == merchantAddress && userSubscriptions[i].status == true) {
                IERC20(usde).transfer(merchantAddress, amount);
            }
        }
    }

    /// @notice Ensures function can only be called by the router contract
    /// @dev Throws if called by any account other than the router
    modifier onlyRouter() {
        require(msg.sender == routerAddress, "No Permision to Call Function");
        _;
    }


}