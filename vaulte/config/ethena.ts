import { defineChain } from 'viem';

export const ethena = defineChain({
    id: 52085143,
    name: 'Ble Testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://testnet.rpc.ethena.fi'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Blockscan',
        url: 'https://testnet.explorer.ethena.fi',
        apiUrl: 'https://testnet.explorer.ethena.fi/api',
      },
    },
    testnet: true,
});