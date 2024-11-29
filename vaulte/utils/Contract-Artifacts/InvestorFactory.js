export const investorFactoryABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_routerAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "usdeAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
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
          "internalType": "string",
          "name": "investorName",
          "type": "string"
        }
      ],
      "name": "createAccount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "investorAddress",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "investorType",
      "outputs": [
        {
          "internalType": "string",
          "name": "investorName",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "investorAddress",
          "type": "address"
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
      "name": "investors",
      "outputs": [
        {
          "internalType": "string",
          "name": "investorName",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "investorAddress",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "routerAddress",
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
      "name": "usde",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]