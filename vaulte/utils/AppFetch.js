import { ethers } from "ethers";
import { Addresses } from "./Contract-Artifacts/Addresses";
import { factoryABI } from "./Contract-Artifacts/UserFactory";
import { ethenaProvider } from "./provider";
import { merchantAccountABI } from "./Contract-Artifacts/merchantAccount";
import { investorAccountABI } from "./Contract-Artifacts/InvestorAccount";
import { poolFactoryABI } from "./Contract-Artifacts/poolFactory";
import { merchantFactoryABI } from "./Contract-Artifacts/merchantFactoryABI";

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
        const factoryContract = new ethers.Contract(Addresses.userFactory, factoryABI, ethenaProvider);
        const userCount = await factoryContract._userCount();
    
        let allOffers = [];
    
        for (let i = 0; i < userCount; i++) {
            const user = await factoryContract.userType(i);
            console.log(user);
            if (user[2] === "investor") {
                const investorAccountContract = new ethers.Contract(user[1], investorAccountABI, ethenaProvider);
                const offerCount = await investorAccountContract._offerCount();
                for (let j = 0; j < offerCount; j++) {
                    const _loanOffer = await investorAccountContract.offers(j);
                    const loanOffer = {
                        investorAddress: user[1],
                        investorName: user[0],
                        offerId: j,
                        offerAmount: _loanOffer[1],
                        repaymentTime: _loanOffer[4],
                        interest: _loanOffer[2]
                    };
                    
                    allOffers.push(loanOffer);
                }
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