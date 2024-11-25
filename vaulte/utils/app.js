const { ethers } = require("ethers");

import { Addresses } from "./Contract-Artifacts/Addresses";
import { investorAccountABI } from "./Contract-Artifacts/InvestorAccount";
import { merchantAccountABI } from "./Contract-Artifacts/merchantAccount";
import { poolABI } from "./Contract-Artifacts/Pool";
import { poolFactoryABI } from "./Contract-Artifacts/poolFactory";
import { routerABI } from "./Contract-Artifacts/Router";
import { factoryABI } from "./Contract-Artifacts/UserFactory";
import { ethenaProvider } from "./provider";

export const getUserStatus = async (address) => {
    try {
        const provider = new ethers.JsonRpcProvider("https://testnet.rpc.ethena.fi");
        const userFactoryContract = new ethers.Contract(Addresses.userFactory, factoryABI, provider);
        const userAccountAddress = await userFactoryContract.getAccountAddress(address);

        const merchantFactoryContract = new ethers.Contract(Addresses.merchantFactory, factoryABI, provider);
        const merchantAccountAddress = await merchantFactoryContract.getAccountAddress(address);

        const investorFactoryContract = new ethers.Contract(Addresses.investorFactory, factoryABI, provider);
        const investorAccountAddress = await investorFactoryContract.getAccountAddress(address);        

        // Check if all addresses are null (zero address)
        const zeroAddress = "0x0000000000000000000000000000000000000000";
        const user = userAccountAddress !== zeroAddress;
        const merchant = merchantAccountAddress !== zeroAddress;
        const investor = investorAccountAddress !== zeroAddress;

        console.log(user, merchant, investor);

        // If all addresses are zero address, return false
        if (!user && !merchant && !investor) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const signUp = async (signer, userName, userType) => {
    try {
        let factoryAddress;

        // Determine which factory address to use based on userType
        if (userType === "investor") {
            factoryAddress = Addresses.investorFactory;
        } else if (userType === "merchant") {
            factoryAddress = Addresses.merchantFactory;
        } else if (userType === "user") {
            factoryAddress = Addresses.userFactory;
        } else {
            throw new Error("Invalid user type");
        }

        const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);
        const createAccountTx = await factoryContract.createAccount(userName);
        const receipt = await createAccountTx.wait();

        if (receipt.status === 1) {
            console.log('account created');
            return true;
        } else {
            console.error("sign up failed!");
            return false;
        }

    } catch(error) {
        console.error(error, "error calling sign up");
        return false;
    }
} 

export const createLoanRequest = async(signer, _loanAmount, interest, loanPeriod) => {
    try {
        const factoryContract = new ethers.Contract(Addresses.merchantFactory, factoryABI, signer);
        const merchantAccountAddress = await factoryContract.getAccountAddress(signer.address);

        const merchantAccountContract = new ethers.Contract(merchantAccountAddress, merchantAccountABI, signer);
        const loanAmount = ethers.parseEther(_loanAmount);
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

export const createLoanOffer = async(signer, _loanAmount, interest, loanPeriod) => {
    try {
        const userFactoryContract = new ethers.Contract(Addresses.userFactory, userFactoryABI, signer);
        const investorAccountAddress = await userFactoryContract.getAccountAddress(signer.address);

        const investorAccountContract = new ethers.Contract(investorAccountAddress, investorAccountABI, signer);
        const loanAmount = ethers.parseEther(_loanAmount);
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

export const createLoanPool = async(signer, poolName, startAmount, interest, loanPeriod) => {
    try {
        const poolFactoryContract = new ethers.Contract(Addresses.poolFactory, poolFactoryABI, signer);
        const createPoolTx = await poolFactoryContract.createPool(poolName, interest, loanPeriod);
        const receipt = await createPoolTx.wait();

        const poolCount = await poolFactoryContract._poolCount();
        const poolId = poolCount - 1;

        if (receipt.status === 1) {
            console.log('pool created');
            const result = await contributePool(signer, startAmount, poolId);
            if (result === true) {
                return true;
            } else {
                return false;
            }
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

const contributePool = async (signer, amount, poolId) => {
    try {
        const poolFactoryConract = new ethers.Contract(Addresses.poolFactory, poolFactoryABI, signer);
        const poolAddress = await poolFactoryConract.getPoolAddress(poolId);
        
        const routerContract = new ethers.Contract(Addresses.router, routerABI, signer);
        const contributeTx = await routerContract.contributePool(poolAddress, amount);
        const receipt = await contributeTx.wait();

        if (receipt.status === 1) {
            console.log('pool funded');
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

const getPoolLoan = async (signer, amount, poolId, loanPeriod) => {
    try {
        const userFactoryContract = new ethers.Contract(Addresses.userFactory, userFactoryABI, signer);
        const merchantAccount = await userFactoryContract.getAccountAddress(signer.address);

        const poolFactoryConract = new ethers.Contract(Addresses.poolFactory, poolFactoryABI, signer);
        const poolAddress = await poolFactoryConract.getPoolAddress(poolId);
        
        const poolContract = new ethers.Contract(poolAddress, poolABI, signer);
        const getLoanTx = await poolContract.getLoan(merchantAccount, amount, loanPeriod);
        const receipt = await getLoanTx.wait();

        if (receipt.status === 1) {
            console.log('loan gotten');
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

export const loanPoolAction = async (signer, amount, poolId) => {
    try {
        const userFactoryContract = new ethers.Contract(Addresses.poolFactory, poolFactoryABI, ethenaProvider);
        const user = await userFactoryContract.users(signer.address);
        console.log(user);
        if (user[2] === "investor") {
            const result = await contributePool(signer, amount, poolId);
            if (result === true) {
                return true;
            } else {
                return false;
            }
        } else if (user[2] === "investor") {
            const result = await getPoolLoan(signer, amount, poolId, 6);
            if (result === true) {
                return true;
            } else {
                return false;
            }
        }
    } catch (error) {
        console.log(error);        
        return false;
    }
}