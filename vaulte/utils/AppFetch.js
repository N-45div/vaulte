import { ethers } from "ethers";
import { Addresses } from "./Contract-Artifacts/Addresses";
import { factoryABI } from "./Contract-Artifacts/UserFactory";
import { ethenaProvider } from "./provider";
import { merchantAccountABI } from "./Contract-Artifacts/MerchantAccount";
import { investorAccountABI } from "./Contract-Artifacts/InvestorAccount";
import { poolFactoryABI } from "./Contract-Artifacts/PoolFactory";
import { merchantFactoryABI } from "./Contract-Artifacts/MerchantFactory";
import { investorFactoryABI } from "./Contract-Artifacts/InvestorFactory";

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

export const getAccountAddress = async (userType, userAddress) => {
    let factoryAddress;
    if (userType === "merchant") {
        factoryAddress = Addresses.merchantFactory;
    } else if (userType === "investor") {
        factoryAddress = Addresses.investorFactory;
    } else if (userType === "user") {
        factoryAddress = Addresses.userFactory;
    }
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, ethenaProvider);
    const accountAddress = await factoryContract.getAccountAddress(userAddress);
    return accountAddress;
}

export const getUserBalance = async (userType, userAddress) => {
    
}
