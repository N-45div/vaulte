// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface IMerchant {
    function getPrice(uint8 tier) external view returns(uint256);
}