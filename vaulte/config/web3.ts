import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { ethena } from './ethena';

export const config = getDefaultConfig({
  appName: 'Vaulte',
  projectId: '6979d82a9d32fcb28f5dd9d2c593d63a',
  chains: [ethena],
});