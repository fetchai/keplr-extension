import { useEffect, useState, createContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import type { Keplr } from '@keplr-wallet/types';
import { HttpEndpoint, StargateClient, QueryClient } from '@cosmjs/stargate';

declare global {
  interface Window {
    keplr: Keplr | undefined;
  }
}
let keplr: Keplr | undefined;
export async function getKeplr(): Promise<Keplr> {
  let gotKeplr: Keplr | undefined;

  if (keplr) {
    gotKeplr = keplr;
  } else if (window.keplr) {
    gotKeplr = window.keplr;
  } else if (document.readyState === 'complete') {
    gotKeplr = window.keplr;
  } else {
    gotKeplr = await new Promise((resolve) => {
      const documentStateChange = (event: Event) => {
        if (
          event.target &&
          (event.target as Document).readyState === 'complete'
        ) {
          resolve(window.keplr);
          document.removeEventListener('readystatechange', documentStateChange);
        }
      };

      document.addEventListener('readystatechange', documentStateChange);
    });
  }

  // TODO: more graceful error handling
  if (!gotKeplr) throw new Error('Keplr not found');
  if (!gotKeplr) keplr = gotKeplr;

  return gotKeplr;
}
export const RPC = 'https://rpc-fetchhub.fetch.ai:443';
export async function stargateClient(rpc: string | HttpEndpoint) {
  const client = await StargateClient.connect(rpc);
  return client;
}
export const WalletContext = createContext<any>({});
// const querClient = QueryClient.staking().
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(
    'Loading balance...'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  /* This effect will fetch wallet address if user has already connected his/her wallet */

  useEffect(() => {
    async function checkConnection() {
      try {
        if (keplr) {
          await connectToWallet();
        } else {
          console.log('window or window.ethereum is not available');
        }
      } catch (error) {
        console.log(error, 'Catch error Account is not connected');
      }
    }
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const setWalletAddress = async () => {
    try {
      const offlineSigner =
        window.keplr && window.keplr.getOfflineSigner('fetchhub');

      if (offlineSigner) {
        const accounts = await offlineSigner.getAccounts();
        const web3Address = accounts[0].address;
        setAddress(web3Address);
        getBalance(RPC, web3Address);
      }
    } catch (error) {
      console.log(
        'Account not connected; logged from setWalletAddress function'
      );
    }
  };

  const getBalance = async (RPC: any, address: string) => {
    const client = await stargateClient(RPC);

    if (address) {
      const balanceObj = await client.getBalance(address, 'afet');
      const balance = `${(parseFloat(balanceObj.amount) / 10 ** 18).toFixed(
        6
      )} ${balanceObj.denom.toUpperCase()}`;
      setBalance(balance);
    }
  };

  const connectToWallet = async () => {
    try {
      setLoading(true);
      const keplr = await getKeplr();
      await keplr.enable('fetchhub');
      setWalletAddress();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(
        error,
        'got this error on connectToWallet catch block while connecting the wallet'
      );
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        loading,
        error,
        connectToWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
