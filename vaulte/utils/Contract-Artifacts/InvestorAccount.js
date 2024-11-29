export const investorAccountABI = [
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
        "name": "makeOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, 
    {
        "inputs": [],
        "name": "_offerCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "_value",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    }, 
    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "offers",
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