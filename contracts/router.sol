// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.27;

// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

// contract Router is Ownable{

//     // /**
//     //  * @notice Utilizing OpenZeppelin's Counters library for managing counters, which includes functions like increment, decrement, and reset.
//     //  */
//     // using Counters for Counters.Counter;

//     // /**
//     //  * @notice Counter for tracking the number of subscribtions.
//     //  */
//     // Counters.Counter public _subscriptionCount;

//     // uint256 public freeTrial;
//     // struct subscription {
//     //     address userAccount;
//     //     uint256 paymentDue;
//     //     bool status;
//     //     uint8 tier;
//     // }

//     // mapping (uint256 => uint) public subscriptions;
//     // mapping (uint8 => uint256) public prices;
//     address public userFactoryAddress;

//     constructor(address _userFactoryAddress) Ownable(msg.sender) {
//         userFactoryAddress = _userFactoryAddress;
//     }

//     // function setPrice(uint8 tier, uint256 price) public onlyOwner() {
//     //     prices[tier] = price;
//     // }

//     // function setFreeTrial(uint256 trialPeriod) public onlyOwner() {
//     //     freeTrial = trialPeriod;
//     // }

//     // function withdraw(uint256 amount, address tokenAddress) public onlyOwner {
//     //     IERC20(tokenAddress).transfer(msg.sender, amount);
//     // }

//     function subscribe(uint8 tier, address merchantAccount) external {
//         // pull free trial from merchant account
//         uint256 freeTrial = IMerchant(merchantAccount).freeTrial();
//         // pull the userAccount from userAccount factory
//         address userAccount = IUserFactory(userFactoryAddress).getAccountAddress(msg.sender);
//         uint256 paymentDue = freeTrial + block.timestamp;
//         // call subscribe on merchant and user accounts
//         IUser(userAccount).subscribe(tier, paymentDue, merchantAccount);
//         IMerchant(merchantAccount).subscribe(tier, paymentDue, userAccount);
//     }
// }

// // functions
// // 1. accept payment/charge 
// // 2. accept/take loan 
// // 3. sevrice loan 
// // 4. withdraw ✅
// // 5. invest USDe
// // 6. convert
