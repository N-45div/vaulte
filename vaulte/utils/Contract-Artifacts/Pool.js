export const poolABI = [
    {
        "inputs": [
          {
            "internalType": "address",
            "name": "merchantAccount",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "loanPeriod_",
            "type": "uint256"
          }
        ],
        "name": "getLoan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
]