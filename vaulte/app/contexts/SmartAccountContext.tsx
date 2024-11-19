import { createContext, useContext, useState, useEffect } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { sepolia } from 'viem/chains';
import { createPublicClient, EIP1193ProviderRpcError, http } from 'viem';
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { KERNEL_V3_1, getEntryPoint } from "@zerodev/sdk/constants"
import { createZeroDevPaymasterClient, createKernelAccount, createKernelAccountClient } from "@zerodev/sdk";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { getSignerFromProvider } from '../utils/converter';

interface SmartAccountContextType {
  kernelClient: any | null;
  isLoading: boolean;
  error: Error | null;
}

const SmartAccountContext = createContext<SmartAccountContextType>({
  kernelClient: null,
  isLoading: true,
  error: null,
});

export function SmartAccountProvider({ children }: { children: React.ReactNode }) {
  const [kernelClient, setKernelClient] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { wallets } = useWallets();

  useEffect(() => {
    async function initializeSmartAccount() {
      try {
        const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
        
        if (!embeddedWallet) {
          setIsLoading(false);
          return;
        }

        const privyProvider = await embeddedWallet.getEthereumProvider();
        const smartAccountSigner = await getSignerFromProvider(privyProvider);

        const publicClient = createPublicClient({
          transport: http(sepolia.rpcUrls.default.http[0]),
        });

        const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
          signer: smartAccountSigner,
          entryPoint: getEntryPoint("0.7"),
          kernelVersion: KERNEL_V3_1,
        });

        const account = await createKernelAccount(publicClient, {
          plugins: {
            sudo: ecdsaValidator,
          },
          entryPoint: ENTRYPOINT_ADDRESS_V07,
        });

        const client = createKernelAccountClient({
          account,
          chain: sepolia,
          entryPoint: ENTRYPOINT_ADDRESS_V07,
          bundlerTransport: http(process.env.NEXT_PUBLIC_BUNDLER_RPC_URL!),
          middleware: {
            sponsorUserOperation: async ({ userOperation }) => {
              const zerodevPaymaster = createZeroDevPaymasterClient({
                chain: sepolia,
                entryPoint: ENTRYPOINT_ADDRESS_V07,
                transport: http(process.env.NEXT_PUBLIC_PAYMASTER_RPC_URL!),
              });
              return zerodevPaymaster.sponsorUserOperation({
                userOperation,
                entryPoint: ENTRYPOINT_ADDRESS_V07,
              });
            }
          }
        });

        setKernelClient(client);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    initializeSmartAccount();
  }, [wallets]);

  return (
    <SmartAccountContext.Provider value={{ kernelClient, isLoading, error }}>
      {children}
    </SmartAccountContext.Provider>
  );
}

export const useSmartAccount = () => useContext(SmartAccountContext); 