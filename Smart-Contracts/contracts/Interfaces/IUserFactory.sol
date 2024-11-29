// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface IUserFactory {
    function getAccountAddress(address accountOwner) external view returns(address);
}