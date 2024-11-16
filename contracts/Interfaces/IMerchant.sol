// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface IMerchant {
    function currentLoanRequest() external view returns (address investor, uint256 loanAmount, uint256 interest, uint256 repaymentAmount, uint256 repaidAmount, uint256 loanPeriod, uint256 monthlyRepaymentAmount);
    function getPrice(uint8 tier) external view returns(uint256);
    function setSubscription(uint8 tier, uint256 paymentDue, address userAccount) external;
    function freeTrial() external view returns (uint256);
    function receiveLoan(address investor) external;
    function getLoan(address investor, uint256 repaymentAmount, uint256 loanPeriod, uint256 monthlyRepaymentAmount) external;
}