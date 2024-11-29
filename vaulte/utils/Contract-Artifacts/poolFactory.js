export const poolFactoryABI = [
    {
        "inputs": [
          {
            "internalType": "string",
            "name": "poolName",
            "type": "string"
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
        "name": "createPool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "poolId",
            "type": "uint256"
          }
        ],
        "name": "getPoolAddress",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "_poolCount",
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
        "name": "pools",
        "outputs": [
          {
            "internalType": "string",
            "name": "poolName",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "poolAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "interest",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
]
