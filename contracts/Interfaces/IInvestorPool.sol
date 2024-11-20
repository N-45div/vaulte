// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface IInvestorPool {
    function getLoan(address merchantAccount, uint256 amount, uint256 loanPeriod_) external;
    function interest() external view returns (uint256);
    function loanPeriod() external view returns (uint256);
    function contribute(address investorAccount, uint256 amount) external;
}