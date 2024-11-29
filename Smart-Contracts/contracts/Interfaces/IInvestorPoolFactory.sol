// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface IInvestorPoolFactory {
    function getPoolAddress(uint256 poolId) external view returns(address);
}