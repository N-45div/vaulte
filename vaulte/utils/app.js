const { ethers } = require("ethers");

import { Addresses } from "./Contract-Artifacts/Addresses";
import { investorAccountABI } from "./Contract-Artifacts/InvestorAccount";
import { merchantAccountABI } from "./Contract-Artifacts/merchantAccount";
import { poolFactoryABI } from "./Contract-Artifacts/poolFactory";
import { routerABI } from "./Contract-Artifacts/Router";
import { userFactoryABI } from "./Contract-Artifacts/UserFactory";

export const createRequest = async(signer, loanAmount, interest, loanPeriod) => {
    try {
        const userFactoryContract = new ethers.Contract(Addresses.userFactory, userFactoryABI, signer);
        const merchantAccountAddress = await userFactoryContract.getAccountAddress(signer.address);

        const merchantAccountContract = new ethers.Contract(merchantAccountAddress, merchantAccountABI, signer);
        const createRequestTx = await merchantAccountContract.makeRequest(loanAmount, interest, loanPeriod);
        const receipt = await createRequestTx.wait();

        if (receipt.status === 1) {
            console.log('request created');
            return true;
        } else {
            console.error("Transaction failed!");
            return false;
        }
    } catch (error) {
        console.error("error calling transaction", error);
        return false;
    }
}

export const createOffer = async(signer, loanAmount, interest, loanPeriod) => {
    try {
        const userFactoryContract = new ethers.Contract(Addresses.userFactory, userFactoryABI, signer);
        const investorAccountAddress = await userFactoryContract.getAccountAddress(signer.address);

        const investorAccountContract = new ethers.Contract(investorAccountAddress, investorAccountABI, signer);
        const createOfferTx = await investorAccountContract.makeRequest(loanAmount, interest, loanPeriod);
        const receipt = await createOfferTx.wait();

        if (receipt.status === 1) {
            console.log('offer created');
            return true;
        } else {
            console.error("Transaction failed!");
            return false;
        }
    } catch (error) {
        console.error("error calling transaction", error);
        return false;
    }
}

export const createPool = async(signer, poolName, startAmount, interest, loanPeriod) => {
    try {
        const poolFactoryContract = new ethers.Contract(Addresses.poolFactory, poolFactoryABI, signer);
        const createPoolTx = await poolFactoryContract.createPool(poolName, interest, loanPeriod);
        const receipt = await createPoolTx.wait();

        if (receipt.status === 1) {
            console.log('pool created');
            return true;
        } else {
            console.error("Transaction failed!");
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const fundRequest = async(signer, merchantAccount) => {
    try {
        const routerContract = new ethers.Contract(Addresses.router, routerABI, signer);
        const fundRequestTx = await routerContract.fundRequest(merchantAccount);
        const receipt = await fundRequestTx.wait();

        if (receipt.status === 1) {
            console.log('request funded');
            return true;
        } else {
            console.error("Transaction failed!");
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const acceptOffer = async(signer, investorAccount, offerId) => {
    try {
        const routerContract = new ethers.Contract(Addresses.router, routerABI, signer);
        const acceptOfferTx = await routerContract.acceptOffer(investorAccount, offerId);
        const receipt = await acceptOfferTx.wait();

        if (receipt.status === 1) {
            console.log('request funded');
            return true;
        } else {
            console.error("Transaction failed!");
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const contributePool = async (signer, amount, poolId) => {
    // get Pool Factory
    // get pool Address
    const poolFactoryConract = new ethers.Contract(Addresses.poolFactory, poolFactoryABI, signer);
    const poolAddress = await poolFactoryConract.getPoolAddress(poolId);
    
    
}