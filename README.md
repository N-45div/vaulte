# Vaulte  

Empowering indie hackers, creatives, and online businesses with flexible, equity-free loans and subscription-based financial solutions.  

---  

## Live Link - https://vaulte-xfni.vercel.app/

## Table of Contents  

1. [Overview](#overview)  
2. [Problem Statement](#problem-statement)  
3. [Solution](#solution)  
4. [How It Works](#how-it-works)  
5. [Technologies Used](#technologies-used)  
6. [Setup and Deployment](#setup-and-deployment)  
7. [Future Improvements](#future-improvements)  
8. [Acknowledgments](#acknowledgments)  

---  

## Overview  

Vaulte is a decentralized platform designed to address the funding challenges faced by indie hackers, creatives, and online businesses. By leveraging cutting-edge DeFi technologies, Vaulte provides equity-free loans, easy repayment options, and subscription-based financial infrastructure, empowering creators to thrive without giving up ownership.  

---  

## Problem Statement  

The lack of accessible, flexible loans for online businesses and indie hackers limits opportunities for growth and innovation. Traditional funding models often demand equity, leaving founders with fewer ownership rights. Existing solutions like indie.vc, Earnest Capital, and TinySeed focus on equity-based funding, but there's room for a more creative, equity-free alternative. Vaulte bridges this gap, providing creators with the financial support they need while allowing them to retain full control of their ventures.  

---  

## Solution  

A decentralized P2P lending platform that allows creatives, indiehackers and online businesses leverage their MRR to get equity-free, low interest loans from pools created and funded by retail investors.

Vaulte solves these challenges with:  
1. **Subscription-Based Payment Infrastructure**: Simplifies user transactions and ensures reliable revenue streams.  
2. **Re-Investing Loan Repayments**: Maximizes financial impact by reinvesting repayments for sustained growth.  
3. **Investor Opportunities**: Offers a 15% APR on investments in USDe, exclusive to investors.  
4. **Loan Pools**: Enables collective contributions to loan pools, fostering collaboration and scalability.  

---  

## How It Works  

1. **For Creators**:  
   - Apply for equity-free loans.  
   - Repay through a simple, flexible plan.  
2. **For Investors**:  
   - Invest in USDe-backed opportunities with a 15% APR.  
   - Reinvest returns for compounding growth.  
3. **For Collectives**:  
   - Create or join loan pools to support like-minded businesses and collect interests on those loans.  

Vaulte is designed in a P2P manner which allows retail investors contribute funds towards a loan pool which merchants can take out loans from and then pay back interest to 
the loan pool. After that the retail investors can then redeem their return on investments after a set period of time.
Merchants can also make requests for loans, this enables them to state their preffered repayment period, the amount they want and the interest they are willing to pay.
Investors on the other hand can also make loan offers and interested merchants can go through those offers and select one that suits their needs.
To make loan repayment easy and seamless for merchants, loan repayments are made in installments anytime the merchant account receives funds from subscriptions, the 
repayment amount to subscription amount is calculated and deducted upon every subscription payment. Merchants have the option to make one time loan repayments as well.
Below are code snippets that show the processes described above.

- creating loan pool
```solidity
    /**
     * @notice Creates a new investment pool
     * @dev Deploys a new InvestorPool contract and stores its information
     * @param poolName Name of the pool to be created
     * @param interest Interest rate for loans in the pool
     * @param loanPeriod Duration of loans in the pool
     */
    function createPool(string memory poolName, uint256 interest, uint256 loanPeriod) external {
        InvestorPool newPool = new InvestorPool(routerAddress, usde, msg.sender, interest, loanPeriod);
        pools[_poolCount.current()].poolName = poolName;
        pools[_poolCount.current()].poolAddress = address(newPool);
        pools[_poolCount.current()].owner = msg.sender;
        pools[_poolCount.current()].interest = interest;
        _poolCount.increment();
    }
```

- Contributing to loan pool
```solidity
    /**
     * @notice Allows an investor to contribute funds to the pool
     * @param investorAccount The address of the investor
     * @param amount The amount of USDE tokens to contribute
     * @dev Only callable by the router contract
     */
    function contribute(address investorAccount, uint256 amount) external onlyRouter() {
        require(amount > 0, "Amount must be greater than 0");
        investors[investorAccount] = amount;
        investmentAmount = investmentAmount + amount;
    }
```

- Getting loan from loan pool
```solidity
    /**
     * @notice Allows a merchant to take out a loan from the pool
     * @param merchantAccount The address of the merchant
     * @param amount The amount of USDE tokens to borrow
     * @param loanPeriod_ The duration of the loan in months
     * @dev Only callable by the router contract
     */
    function getLoan(address merchantAccount, uint256 amount, uint256 loanPeriod_) external onlyRouter() {
        require(amount > 0, "Amount must be greater than 0");
        require(investmentAmount > 0, "Pool has no funds");
        
        uint256 amountPercentage = (amount * 100) / investmentAmount;
        require(amountPercentage <= 10, "Amount too high");
        require(loanPeriod_ <= loanPeriod, "max repayment period exceeded");

        uint256 repaymentAmount = amount + ((interest * amount) / 100);
        uint256 monthlyRepaymentAmount = repaymentAmount / loanPeriod_;
        
        uint256 loanId = _loanCount.current();
        loans[loanId] = loan(
            merchantAccount,
            repaymentAmount,
            0,
            loanPeriod_,
            monthlyRepaymentAmount
        );
        _loanCount.increment();

        require(IERC20(usde).transfer(merchantAccount, amount), "Transfer failed");
    }
```

The code for other processes mentioned above can be found [here](https://github.com/N-45div/vaulte/blob/
Ethena-Hackathon/Smart-Contracts/contracts).

### Visual Flow  
(Add a flowchart or user journey diagram here to illustrate the process.)  

---  

## Technologies Used  

| **Technology**    | **Purpose**                                              |  
|-------------------|----------------------------------------------------------|  
| **Next.js**       | Frontend framework for building the user interface.      | 
| **Solidity**      | Smart contracts that enable platform functionalities.    |
| **Ethena**        | Smart contract deployment and USDe for payments.         |  
| **Goldsky**       | Smart contract data indexing and dapp insight extraction.|  

### Solidity

Various smart contracts were written to handle the core functionalities of the dapp, here's a run down of the smart contracts and their functions.

- Investor Account - This serves as the contract account for investors and the main functionality of this smart contract is for investors to create 
pools and loan offers, it also enables invesstors to accept loan requests. The full code is found [here](https://github.com/N-45div/vaulte/blob/
Ethena-Hackathon/Smart-Contracts/contracts/InvestorAccount.sol).

- Investor Factory - The main functionality of this smart contract is to deploy investor account smart contracts and keeping track of them. The full 
code is found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/InvestorFactory.sol).

- Investor Pool - This smart contract helps deliver one of the core functionalities of the platform i.e pulling investor funds in a central pool. 
Investors can contribute/invest funds and redeem returns in an investor pool contract and merchants can access loans in an agnostic manner from an 
investor pool. The full code is found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/InvestorPool.sol).

- Merchant Account - This serves as the contract account for merchants and the main functionality of this smart contract is for merchants to create 
loan requests, enables invesstors to accept loan offers and to pay off loans. The full code is found [here](https://github.com/N-45div/vaulte/blob/
Ethena-Hackathon/Smart-Contracts/contracts/MerchantAccount.sol).

- Merchant Factory - The main functionality of this smart contract is to deploy merchant account smart contracts and keeping track of them. The full 
code is found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/MerchantFactory.sol).

- Pool Factory - The main functionality of this smart contract is to deploy investor pool smart contracts and keeping track of them. The full code is 
found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/PoolFactory.sol).

- Router - The main functionality of this smart contract as the name implies is to cordinate transactions between contracts without overexposing them 
(some functions in other contracts are marked with the onlyRouter modifier). The events in this contract are indexed and tracked by the deployed 
subgraph. The full code is found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/router.sol).

- User Account - This serves as the contract account for end users and the main functionality of this smart contract is for end users to subscribe to 
merchants and pay for subscriptions. The full code is found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/
userAccount.sol).

- User Factory - The main functionality of this smart contract is to deploy user account smart contracts and keeping track of them. The full code is 
found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/UserFactory.sol).

### Ethena

The smart contracts for the dapp were deployed on on the Ethena ble testnet and USDe is the primary token used throughout the dapp from payments
to disbursing loans.
Below is a run through of the contracts deployments and transaction hashes

| **Contract**        | **Addres**                                 | **TXHash**                                                         |
|---------------------|--------------------------------------------|--------------------------------------------------------------------|
| **Router**          | 0x0058e73DE38A00a870beEA2b0185432C9b01eA61 | 0x92c592d46ddd3b17103bc9a88cf97c43bcea1c34ed913e872750a7753b7a43b3 |
| **userFactory**     | 0x8b576DAdF5b8ecE2DD38160448ABAF64fC70f062 | 0x4e18ce9ff7dd3217240d947348b86d1377eedbabaf2a97367760319d60fd3a36 |
| **investorFactory** | 0xd85259F42bF53c35c041ABfd3A2C38a10Bc40ec7 | 0x3ad80a8597c647b3d4f08c1a87ec82586f314e4b9cf81d865254faa5c3a267f9 |
| **merchantFactory** | 0xb34817bEE783107Aad0077E27c20977146684ED4 | 0x37f51fd42871b2fa0b07daf191633878840e2414112a0cec0df8356a4fc5f389 | 
| **poolFactory**     | 0x5474C94152DFeB642607758dECF156f590D092dD | 0x05de26cb8d0c1359cc5c0f63e549bf65d1c703b5095b97f5073ffadceae47baf |
| **MerchantAccount** |  |  |
| **InvestorAccount** |  |  |

USDe was utilized in the disbursement of loans as well as for subscription payments, below are some code snippets showing how usde was utilized

- subscription payment

```solidity
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
```

- Pool loan processing

```solidity
    /**
     * @notice Allows a merchant to take out a loan from the pool
     * @param merchantAccount The address of the merchant
     * @param amount The amount of USDE tokens to borrow
     * @param loanPeriod_ The duration of the loan in months
     * @dev Only callable by the router contract
     */
    function getLoan(address merchantAccount, uint256 amount, uint256 loanPeriod_) external onlyRouter() {
        require(amount > 0, "Amount must be greater than 0");
        require(investmentAmount > 0, "Pool has no funds");
        
        uint256 amountPercentage = (amount * 100) / investmentAmount;
        require(amountPercentage <= 10, "Amount too high");
        require(loanPeriod_ <= loanPeriod, "max repayment period exceeded");

        uint256 repaymentAmount = amount + ((interest * amount) / 100);
        uint256 monthlyRepaymentAmount = repaymentAmount / loanPeriod_;
        
        uint256 loanId = _loanCount.current();
        loans[loanId] = loan(
            merchantAccount,
            repaymentAmount,
            0,
            loanPeriod_,
            monthlyRepaymentAmount
        );
        _loanCount.increment();

        require(IERC20(usde).transfer(merchantAccount, amount), "Transfer failed");
    }
```

### Goldsky

Goldsky was used for indexing smart contract events and getting insights from those indexed events.
The router smart contract emits some events for major functions like when a subscription is paid and when a loan is disbursed.

```solidity
event Subscription(address userAccount, address merchantAccount, uint256 tier, uint256 subTime);
event SubscriptionPayment(address userAccount, address merchantAccount, uint256 paymentAmount, uint256 paymentTime);
event LoanDisbursed(address investorAccount, address merchantAccount, uint256 amount, uint8 loanCategory);
```

Below is the graphql schema of the subgraph deployed on goldsky

```graphql
type LoanDisbursed @entity(immutable: true) {
  id: Bytes!
  investorAccount: Bytes! # address
  merchantAccount: Bytes! # address
  amount: BigInt! # uint256
  loanCategory: Int! # uint8
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type OwnershipTransferred @entity(immutable: true) {
  id: Bytes!
  previousOwner: Bytes! # address
  newOwner: Bytes! # address
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type Sub @entity(immutable: true) {
  id: Bytes!
  userAccount: Bytes! # address
  merchantAccount: Bytes! # address
  tier: BigInt! # uint256
  subTime: BigInt! # uint256
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type SubscriptionPayment @entity(immutable: true) {
  id: Bytes!
  userAccount: Bytes! # address
  merchantAccount: Bytes! # address
  paymentAmount: BigInt! # uint256
  paymentTime: BigInt! # uint256
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

the full subgraph folder can be found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/subgraph)

we used the api endpoint provided by Goldsky get insights into the platform, such insights include a merchants MRR, 
amount contributed/disbursed by an investor etc
the subgraph is used in the dashboard pages as well as the stats page that showcases various stats about the dapp.
below shows how the subgraph was queried in order to get the total amount of loans disbursed and the the total amount in USDe.

```javascript
async function getTotalNumberOfLoansDisbursed() {
  const query = `
    query GetTotalLoans {
      loanDisburseds {
        id
      }
    }
  `;

  const response = await fetch(
    "https://api.goldsky.com/api/public/project_cm3ncp19ujci701vq9ub0hkzm/subgraphs/Vaulte/1.0.0/gn",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }
  );

  const data = await response.json();
  const totalLoans = data.data.loanDisburseds.length;

  return totalLoans;
}

async function getTotalAmountDisbursed() {
  const query = `
    query GetTotalLoanAmounts {
      loanDisburseds {
        amount
      }
    }
  `;

  const response = await fetch(
    "https://api.goldsky.com/api/public/project_cm3ncp19ujci701vq9ub0hkzm/subgraphs/Vaulte/1.0.0/gn",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }
  );

  const data = await response.json();
  const loans = data.data.loanDisburseds;

  // Sum up all amounts and convert from BigInt with 18 decimals
  const totalAmount = loans.reduce((sum, loan) => {
    const amount = Number(loan.amount) / 1e18; // Convert to readable format
    return sum + amount;
  }, 0);

  return totalAmount;
}
```
the full code to how the subgraph is queried can be found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/vaulte/utils/AppFetch.js)

below is the api endpoint provided by goldsky which can enable anyone query the subgraph: "https://api.goldsky.com/api/public/project_cm3ncp19ujci701vq9ub0hkzm/subgraphs/Vaulte/1.0.0/gn"

---  

## Setup and Deployment  

### Prerequisites  

- Node.js v16+  
- Solidity development environment  
- Blockchain wallets (e.g., MetaMask)  

### Local Setup  

1. Clone this repository:  
    ```bash  
    git clone <repository-url>  
    ```  
2. Navigate to the project directory:  
    ```bash  
    cd vaulte  
    ```  
3. Install dependencies:  
    ```bash  
    npm install  
    ```  
4. Set up environment variables:  
    ```  
    GOLD_SKY_API_KEY=<your-key>  
    LAYER_ZERO_ENDPOINT=<your-endpoint>  
    ```  
5. Run the application:  
    ```bash  
    npm start  
    ```  

---  

## Future Improvements  

1. Expand loan pool functionalities with multi-chain support.
2. Extensive audits on the protocol's smart contracts.
3. Improve on and build out a full fledged payment system for creatives, indiehackers and end users.

---  

## Acknowledgments  

Special thanks to **Ethena x Encode Hackathon 2024** organizers: Ethena and Encode and the sponsors: Goldsky and LayerZero. Their technologies played a pivotal role in building Vaulte’s functionality and impact.
