// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface IUser {
    function subscribe(uint8 tier, uint256 paymentDue, address merchantAccount) external;
    function paySubscription(uint256 amount, address merchantAddress) external;
}