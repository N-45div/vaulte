'use client';

import {PrivyProvider} from '@privy-io/react-auth';
import { SmartAccountProvider } from '../contexts/SmartAccountContext';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'dark',
          accentColor: '#3B82F6'
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <SmartAccountProvider>
        {children}
      </SmartAccountProvider>
    </PrivyProvider>
  );
}