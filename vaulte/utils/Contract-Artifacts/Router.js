export const routerABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "investorAccount",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "merchantAccount",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "loanCategory",
          "type": "uint8"
        }
      ],
      "name": "LoanDisbursed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "userAccount",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "merchantAccount",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tier",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "subTime",
          "type": "uint256"
        }
      ],
      "name": "Subscription",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "userAccount",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "merchantAccount",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "paymentAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "paymentTime",
          "type": "uint256"
        }
      ],
      "name": "SubscriptionPayment",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "investorAccount",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        }
      ],
      "name": "acceptOffer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "userAccount",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "merchantAccount",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "charge",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "merchantAccount",
          "type": "address"
        }
      ],
      "name": "fundRequest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "investorPool",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "loanAmount",
          "type": "uint256"
        }
      ],
      "name": "getLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
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
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userFactoryAddress",
          "type": "address"
        }
      ],
      "name": "setFactory",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "tier",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "merchantAccount",
          "type": "address"
        }
      ],
      "name": "subscribe",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "userFactoryAddress",
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
          "internalType": "address",
          "name": "investorPool",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "contributePool",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]