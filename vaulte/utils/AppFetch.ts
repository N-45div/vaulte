interface LoanRequestInfo {
    merchantAddress: string;
    merchantName: string;
    merchantMRR: number;
    requestAmount: number;
    repaymentAmount: number;
    interest: number;
}

interface LoanOfferInfo {
    investorAddress: string;
    investorName: string;
    offerId: number;
    offerAmount: number;
    repaymentAmount: number;
    interest: number;
}

interface LoanPoolInfo {
    poolName: string;
    interest: number;
    poolAddress: string;
}

