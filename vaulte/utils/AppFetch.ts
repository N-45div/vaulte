import { ethers } from "ethers";
import { Addresses } from "./Contract-Artifacts/Addresses";
import { userFactoryABI } from "./Contract-Artifacts/UserFactory";
import { ethenaProvider } from "./provider";
import { merchantAccountABI } from "./Contract-Artifacts/merchantAccount";
import { investorAccountABI } from "./Contract-Artifacts/InvestorAccount";
import { poolFactoryABI } from "./Contract-Artifacts/poolFactory";
interface LoanRequestInfo {
    merchantAddress: string;
    merchantName: string;
    merchantMRR: number;
    requestAmount: number;
    repaymentTime: number;
    interest: number;
}

interface LoanOfferInfo {
    investorAddress: string;
    investorName: string;
    offerId: number;
    offerAmount: number;
    repaymentTime: number;
    interest: number;
}

interface LoanPoolInfo {
    poolName: string;
    interest: number;
    poolAddress: string;
}

export const fetchLoanRequests = async () => {
    try {
        const userFactoryContract = new ethers.Contract(Addresses.userFactory, userFactoryABI, ethenaProvider);
        const userCount = await userFactoryContract._userCount();
    
        let allRequests: LoanRequestInfo[] = [];
    
        for (let i = 0; i < userCount; i++) {
            const user = await userFactoryContract.userType(i);
            console.log(user);
            if (user[2] === "merchant") {
                const merchantAccountContract = new ethers.Contract(user[1], merchantAccountABI, ethenaProvider);
                const currentLoanRequest = await merchantAccountContract.currentLoanRequest();
                // get MRR function
                if (currentLoanRequest[1] != 0) {
                    const loanRequest: LoanRequestInfo = (user[1], user[0], 0, currentLoanRequest[1], currentLoanRequest[5], currentLoanRequest[2]);
                    allRequests.push(loanRequest);
                }
            }
        }
    
        return allRequests;
    } catch (error) {
        console.log(error);
    }
}

export const fetchLoanOffers = async () => {
    try {
        const userFactoryContract = new ethers.Contract(Addresses.userFactory, userFactoryABI, ethenaProvider);
        const userCount = await userFactoryContract._userCount();
    
        let allOffers: LoanOfferInfo[] = [];
    
        for (let i = 0; i < userCount; i++) {
            const user = await userFactoryContract.userType(i);
            console.log(user);
            if (user[2] === "investor") {
                const investorAccountContract = new ethers.Contract(user[1], investorAccountABI, ethenaProvider);
                const offerCount = await investorAccountContract._offerCount();
                for (let j = 0; j < offerCount; j++) {
                    const _loanOffer = await investorAccountContract.offers(j);
                    const loanOffer: LoanOfferInfo = (user[1], user[0], j, _loanOffer[1], _loanOffer[4], _loanOffer[2]);
                    
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

        let allPools: LoanPoolInfo[] = [];

        for (let i = 0; i < poolCount; i++) {
            const pool = await poolFactoryContract.pools(i);
            const loanPool: LoanPoolInfo = (pool[0], pool[3], pool[1]);
            allPools.push(loanPool);
        }
    } catch (error) {
        console.log(error);
    }
}