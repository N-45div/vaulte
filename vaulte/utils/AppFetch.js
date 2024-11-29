import { ethers } from "ethers";
import { Addresses } from "./Contract-Artifacts/Addresses";
import { factoryABI } from "./Contract-Artifacts/UserFactory";
import { ethenaProvider } from "./provider";
import { merchantAccountABI } from "./Contract-Artifacts/merchantAccount";
import { investorAccountABI } from "./Contract-Artifacts/InvestorAccount";
import { poolFactoryABI } from "./Contract-Artifacts/poolFactory";
import { merchantFactoryABI } from "./Contract-Artifacts/merchantFactoryABI";
import { investorFactoryABI } from "./Contract-Artifacts/InvestorFactory";
import { erc20ABI } from "./Contract-Artifacts/ERC20"

// Removed TypeScript interfaces - keeping comments for reference structure
/*
LoanRequestInfo {
    merchantAddress: string
    merchantName: string
    merchantMRR: number
    requestAmount: number
    repaymentTime: number
    interest: number
}
*/

export const fetchLoanRequests = async () => {
    try {
        const factoryContract = new ethers.Contract(Addresses.merchantFactory, merchantFactoryABI, ethenaProvider);
        const merchantCount = await factoryContract._merchantCount();
        
        console.log(merchantCount);
        
        let allRequests = [];
    
        for (let i = 0; i < merchantCount; i++) {
            const merchant = await factoryContract.merchantType(i);
            console.log(merchant[1]);
                const merchantAccountContract = new ethers.Contract(merchant[1], merchantAccountABI, ethenaProvider);
                const currentLoanRequest = await merchantAccountContract.currentLoanRequest();
                // get MRR function
                const requestAmount = Number(ethers.formatEther(currentLoanRequest[1]));
                if (currentLoanRequest[1] != 0) {
                    const loanRequest = {
                        merchantAddress: merchant[1],
                        merchantName: merchant[0],
                        merchantMRR: 0,
                        requestAmount: requestAmount,
                        repaymentTime: currentLoanRequest[5],
                        interest: currentLoanRequest[2]
                    };
                    allRequests.push(loanRequest);
                }
        }
    
        return allRequests;
    } catch (error) {
        console.log(error);
    }
}

export const fetchLoanOffers = async () => {
    try {
        const factoryContract = new ethers.Contract(Addresses.investorFactory, investorFactoryABI, ethenaProvider);
        const investorCount = await factoryContract._userCount();
    
        let allOffers = [];
    
        for (let i = 0; i < investorCount; i++) {
            const investor = await factoryContract.investorType(i);
            const investorAccountContract = new ethers.Contract(investor[1], investorAccountABI, ethenaProvider);
            const offerCount = await investorAccountContract._offerCount();
            for (let j = 0; j < offerCount; j++) {
                const _loanOffer = await investorAccountContract.offers(j);
                const offerAmount = Number(ethers.formatEther(_loanOffer[1]));
                const loanOffer = {
                    investorAddress: investor[1],
                    investorName: investor[0],
                    offerId: j,
                    offerAmount: offerAmount,
                    repaymentTime: _loanOffer[4],
                    interest: _loanOffer[2]
                };
                allOffers.push(loanOffer);
            }
        }
    
        return allOffers;
    } catch (error) {
        console.log(error);
    }
}

export const fetchLoanPools = async () => {
    try {
        const poolFactoryContract = new ethers.Contract(Addresses.poolFactory, poolFactoryABI, ethenaProvider);
        const poolCount = await poolFactoryContract._poolCount();

        let allPools = [];

        for (let i = 0; i < poolCount; i++) {
            const pool = await poolFactoryContract.pools(i);
            const loanPool = {
                poolName: pool[0],
                interest: pool[3],
                poolAddress: pool[1]
            };
            allPools.push(loanPool);
        }

        return allPools;
    } catch (error) {
        console.log(error);
    }
}

export const getMerchantDetails = async (merchantAddress) => {
    const factoryContract = new ethers.Contract(Addresses.merchantFactory, factoryABI, ethenaProvider);
    const accountAddress = await factoryContract.getAccountAddress(merchantAddress);

    const usdeContract = new ethers.Contract(Addresses.usde, erc20ABI, ethenaProvider);
    const _accountBalance = await usdeContract.balanceOf(accountAddress);
    const accountBalance = ethers.formatEther(_accountBalance);

    const mrr = await getMRR(merchantAddress);

    const currentLoan = await merchantCurrentLoan(accountAddress);

    const startTime = Math.floor(new Date("2024-11-20T00:00:00Z").getTime() / 1000); // Default start time
  
    const revenue = await getMonthlyRevenue(merchantAddress, startTime);

    const subscriberInfo = await getSubscribers(merchantAddress);

    return {accountAddress, accountBalance, mrr, currentLoan, revenue, subscriberInfo};
}

async function getSubscriptionPayments(merchant, startTime) {
    const query = `
      query GetSubscriptionPayments($merchant: Bytes!, $startTime: BigInt!) {
        subscriptionPayments(
          where: { merchantAccount: $merchant, paymentTime_gte: $startTime }
          orderBy: paymentTime
          orderDirection: asc
        ) {
          paymentAmount
          paymentTime
        }
      }
    `;
  
    const variables = {
      merchant,
      startTime,
    };
  
    const response = await fetch(
      "https://api.goldsky.com/api/public/project_cm3ncp19ujci701vq9ub0hkzm/subgraphs/Vaulte/1.0.0/gn",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      }
    );
    const data = await response.json();
    return data.data.subscriptionPayments;
}
  
async function getMRR(merchant, startTime = Math.floor(new Date("2024-11-20T00:00:00Z").getTime() / 1000)) {
    const payments = await getSubscriptionPayments(merchant, startTime);
  
    // Group payments by month
    const monthlyPayments = {};
    payments.forEach(payment => {
      const date = new Date(payment.paymentTime * 1000); // Convert to JavaScript timestamp
      const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`; // Group by year-month
      if (!monthlyPayments[monthKey]) monthlyPayments[monthKey] = 0;
      monthlyPayments[monthKey] += parseInt(payment.paymentAmount, 10);
    });
  
    // Calculate average MRR
    const months = Object.keys(monthlyPayments);
    const totalRevenue = Object.values(monthlyPayments).reduce((sum, amount) => sum + amount, 0);
    const mrr = totalRevenue / months.length;
  
    console.log("Monthly Payments:", monthlyPayments);
    console.log("Total Revenue:", totalRevenue);
    console.log("MRR:", mrr);
  
    return mrr;
}

const merchantCurrentLoan = async (merchantAccount) => {
    const merchantAccountContract = new ethers.Contract(merchantAccount, merchantAccountABI, ethenaProvider);
    const currentLoanRequest = await merchantAccountContract.currentLoanRequest();
    
    const investorAddress = currentLoanRequest[0];
    const investorName = await getInvestorName(investorAddress);
    const loanAmount = Number(ethers.formatEther(currentLoanRequest[1]));
    const loanPeriod = currentLoanRequest[5];

    return {investorName, loanAmount, loanPeriod};
}

const getInvestorName = async (investorAddress) => {
    const factoryContract = new ethers.Contract(Addresses.investorFactory, investorFactoryABI, ethenaProvider);
    const investorCount = await factoryContract._userCount();
    
    for (let i = 0; i < investorCount; i++) {
        const investor = await factoryContract.investorType(i);
        if (investor[1].toLowerCase() === investorAddress.toLowerCase()) {
            return investor[0];
        }
    }
    
    return "Investor";
}

async function getMonthlyRevenue(merchant, startTime) {
    const query = `
      query GetSubscriptionPayments($merchant: Bytes!, $startTime: BigInt!) {
        subscriptionPayments(
          where: { merchantAccount: $merchant, paymentTime_gte: $startTime }
          orderBy: paymentTime
          orderDirection: asc
        ) {
          paymentAmount
          paymentTime
        }
      }
    `;
  
    const variables = {
      merchant,
      startTime,
    };
  
    const response = await fetch(
      "https://api.goldsky.com/api/public/project_cm3ncp19ujci701vq9ub0hkzm/subgraphs/Vaulte/1.0.0/gn",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      }
    );
  
    const data = await response.json();
    const payments = data.data.subscriptionPayments;
  
    // Map of month numbers to 3-letter month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    // Group payments by month
    const monthlyRevenue = {};
    payments.forEach((payment) => {
      const date = new Date(payment.paymentTime * 1000); // Convert to JavaScript timestamp
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth(); // Month index (0-11)
      const monthKey = `${monthNames[month]}-${year}`; // Example: "Jan-2024"
  
      if (!monthlyRevenue[monthKey]) monthlyRevenue[monthKey] = 0;
  
      // Convert paymentAmount from BigInt with 18 decimals to a readable number
      const amountInUnits = Number(payment.paymentAmount) / 1e18;
      monthlyRevenue[monthKey] += amountInUnits;
    });
  
    return monthlyRevenue;
}

async function getSubscribers(merchant) {
    const query = `
      query GetSubscribers($merchant: Bytes!) {
        subs(where: { merchantAccount: $merchant }) {
          userAccount
        }
      }
    `;
  
    const variables = {
      merchant,
    };
  
    const response = await fetch(
      "https://api.goldsky.com/api/public/project_cm3ncp19ujci701vq9ub0hkzm/subgraphs/Vaulte/1.0.0/gn",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      }
    );
  
    const data = await response.json();
    const subscribers = data.data.subs;
  
    // Get unique subscribers (if duplicates exist in the Sub entity)
    const uniqueSubscribers = [...new Set(subscribers.map((sub) => sub.userAccount))];
  
    return {
      totalSubscribers: uniqueSubscribers.length,
      subscribers: uniqueSubscribers,
    };
}
  