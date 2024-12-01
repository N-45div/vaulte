# Vaulte  

Empowering indie hackers, creatives, and online businesses with flexible, equity-free loans and subscription-based financial solutions.  

---  

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
pools and loan offers, it also enables invesstors to accept loan requests. The full code is found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/InvestorAccount.sol).

- Investor Factory - The main functionality of this smart contract is to deploy investor account smart contracts and keeping track of them. The full 
code is found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/InvestorFactory.sol).

- Investor Pool - This smart contract helps deliver one of the core functionalities of the platform i.e pulling investor funds in a central pool. 
Investors can contribute/invest funds and redeem returns in an investor pool contract and merchants can access loans in an agnostic manner from an 
investor pool. The full code is found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/InvestorPool.sol).

- Merchant Account - This serves as the contract account for merchants and the main functionality of this smart contract is for merchants to create 
loan requests, enables invesstors to accept loan offers and to pay off loans. The full code is found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/MerchantAccount.sol).

- Merchant Factory - The main functionality of this smart contract is to deploy merchant account smart contracts and keeping track of them. The full 
code is found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/MerchantFactory.sol).

- Pool Factory - The main functionality of this smart contract is to deploy investor pool smart contracts and keeping track of them. The full code is 
found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/PoolFactory.sol).

- Router - The main functionality of this smart contract as the name implies is to cordinate transactions between contracts without overexposing them 
(some functions in other contracts are marked with the onlyRouter modifier). The events in this contract are indexed and tracked by the deployed 
subgraph. The full code is found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/router.sol).

- User Account - This serves as the contract account for end users and the main functionality of this smart contract is for end users to subscribe to 
merchants and pay for subscriptions. The full code is found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/userAccount.sol).

- User Factory - The main functionality of this smart contract is to deploy user account smart contracts and keeping track of them. The full code is 
found [here](https://github.com/N-45div/vaulte/blob/Ethena-Hackathon/Smart-Contracts/contracts/UserFactory.sol).

### Ethena

The smart contracts for the dapp were deployed on on the Ethena ble testnet and USDe is the primary token used throughout the dapp from payments
to disbursing loans.
Below is a run through of the contracts deployments and transaction hashes


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
2. Integrate support for multiple stablecoins.  
3. Add analytics dashboards for creators and investors.  
4. Explore dynamic APR based on market conditions.  

---  

## Acknowledgments  

Special thanks to **Ethena x Encode Hackathon 2024** organizers: Ethena and Encode and the sponsors: Goldsky and LayerZero. Their technologies played a pivotal role in building Vaulte’s functionality and impact.
