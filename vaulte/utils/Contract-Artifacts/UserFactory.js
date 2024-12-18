export const factoryABI = [
    {
        "inputs": [
          {
            "internalType": "address",
            "name": "accountOwner",
            "type": "address"
          }
        ],
        "name": "getAccountAddress",
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
        "name": "_userCount",
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
        "name": "userType",
        "outputs": [
          {
            "internalType": "string",
            "name": "userName",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "userAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "role",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    }, 
    {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "users",
        "outputs": [
          {
            "internalType": "string",
            "name": "userName",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "userAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "role",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "userName",
          "type": "string"
        }
      ],
      "name": "createAccount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]