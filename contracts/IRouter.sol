// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface IRouter {
    function charge(address userAccount, address merchantAccount, uint256 subscriptionAmount) external;
}