// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface IInvestor {
    function acceptRequest(address merchant, uint256 loanAmount, uint256 interest, uint256 loanPeriod, uint256 monthlyRepaymentAmount) external;
    function offers(uint256 id) external view returns (address investor, uint256 loanAmount, uint256 interest, uint256 repaidAmount, uint256 loanPeriod, uint256 monthlyRepaymentAmount);
    function disburseLoanOffer(address merchant, uint256 offerId) external;
    function contributePool(address pool, uint256 amount) external;
}