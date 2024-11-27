# Vaulte

Vaulte is a decentralized finance (DeFi) platform that streamlines subscription payments, reinvestments, and loan management, leveraging cutting-edge blockchain technology for unparalleled financial flexibility.

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

Vaulte is designed for Ethena x Encode Hackathon 2024, addressing critical challenges in decentralized finance. The platform enables seamless subscription payments, reinvestments of loan repayments, and collective loan pool creation, powered by **Goldsky** and **LayerZero** technologies. Vaulte provides users, merchants, and investors with tools to optimize financial transactions while maintaining transparency and efficiency.  

---

## Problem Statement  

The lack of accessible loans for online businesses and indie hackers creates a significant hurdle for creatives and small-scale entrepreneurs. Current investment models often demand equity, leaving founders with fewer ownership rights. While platforms like indie.vc, Earnest Capital, and TinySeed exist, they primarily focus on equity-based funding. *Vaulte* seeks to solve this by offering flexible, equity-free loan solutions tailored to the needs of creatives, making repayment simple and empowering independent creators to retain full control of their ventures.  

---

## Solution

Vaulte leverages blockchain and DeFi principles to address these challenges:  

1. **Payment Infrastructure**: Enabling seamless subscription management with transparent and low-cost transactions.  
2. **Re-Investment of Loan Repayments**: Automating the reinvestment process to maximize capital utilization.  
3. **Investor Opportunities**: Offering a USDe-backed 15% APR reinvestment option, exclusive to investors.  
4. **Loan Pools**: Allowing individuals to collectively contribute to and benefit from loan pools.  

This approach ensures accessibility, scalability, and security for all stakeholders.

---

## How It Works

### Key Features

- **Subscription Payments**  
  Vaulte simplifies recurring payments, offering merchants and users a robust infrastructure to manage subscriptions.

- **Reinvestment Mechanism**  
  Loan repayments are automatically reinvested, enhancing capital efficiency and reducing manual intervention.

- **Investor-Exclusive Reinvestments**  
  Investors can access a USDe-backed investment plan with a 15% APR, fostering reliable returns.

- **Loan Pools**  
  Individuals can collectively contribute to loan pools, diversifying risks and supporting small businesses.

### Workflow  

1. Users and merchants interact with Vaulte’s interface (built with **Next.js**) for subscription setup and payment processing.  
2. Loan repayments are processed via smart contracts (written in **Solidity**) and reinvested automatically.  
3. Investors access exclusive financial products integrated with **Goldsky** and **LayerZero** technologies for optimized backend functionality.  

---

## Technologies Used  

| **Technology** | **Purpose** |  
| --- | --- |  
| **Next.js** | Frontend development |  
| **Solidity** | Smart contract development |  
| **Goldsky** | Enhanced backend data processing |  
| **LayerZero** | Cross-chain interoperability |  

---

## Setup and Deployment  

### Prerequisites  

- **Node.js** (v16+)  
- Blockchain wallets (e.g., MetaMask)  
- **Next.js** installed globally  

### Local Setup  

1. Clone the repository:  
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

4. Set up environment variables in a `.env` file:  
    ```  
    NEXT_PUBLIC_API_KEY=<your-key>  
    SMART_CONTRACT_ADDRESS=<contract-address>  
    ```  

5. Start the development server:  
    ```bash  
    npm run dev  
    ```  

### Deployment  

Deployed on platforms like **Vercel** for frontend and Ethereum-compatible networks for smart contracts.  
- Live demo: [Vaulte Demo](https://vaulte.ethena-hackathon.com)  

---

## Future Improvements  

1. **Enhanced Subscription Analytics**: Introduce advanced dashboards for merchants to monitor subscription metrics.  
2. **Multi-Currency Support**: Allow payments and reinvestments in various stablecoins.  
3. **Expanded Loan Pool Functionality**: Include additional options like weighted contributions and custom interest rates.  
4. **Scalability**: Optimize smart contracts for higher throughput and lower gas fees.  

---

## Acknowledgments  

Special thanks to:  
- **Ethena x Encode Hackathon 2024** for providing the platform to innovate.  
- **Goldsky** and **LayerZero** for sponsoring and enabling advanced functionality in the backend.  
- The open-source community for their valuable resources.  
