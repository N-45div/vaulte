export const merchantAccountABI = [
    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "loanAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "interest",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "loanPeriod",
            "type": "uint256"
          }
        ],
        "name": "makeRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, 
    {
        "inputs": [],
        "name": "currentLoanRequest",
        "outputs": [
          {
            "internalType": "address",
            "name": "investor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "loanAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "interest",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "repaymentAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "repaidAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "loanPeriod",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "monthlyRepaymentAmount",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] 