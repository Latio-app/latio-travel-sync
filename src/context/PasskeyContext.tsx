import React, { createContext, useContext, useState } from 'react';
import { PasskeyKit, PasskeyServer, SACClient } from 'passkey-kit';
import { Server } from '@stellar/stellar-sdk/minimal/rpc';

interface PasskeyContextProps {
  isConnected: boolean;
  connect: () => void;
}

const PasskeyContext = createContext<PasskeyContextProps | null>(null);

export const usePasskey = () => useContext(PasskeyContext)!;

export const PasskeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      const rpc = new Server(import.meta.env.VITE_rpcUrl);

      // Initialize PasskeyKit
      const account = new PasskeyKit({
        rpcUrl: import.meta.env.VITE_rpcUrl,
        networkPassphrase: import.meta.env.VITE_networkPassphrase,
        walletWasmHash: import.meta.env.VITE_walletWasmHash,
      });

      const server = new PasskeyServer({
        rpcUrl: import.meta.env.VITE_rpcUrl,
        launchtubeUrl: import.meta.env.VITE_launchtubeUrl,
        launchtubeJwt: import.meta.env.VITE_launchtubeJwt,
        mercuryProjectName: import.meta.env.VITE_mercuryProjectName,
        mercuryUrl: import.meta.env.VITE_mercuryUrl,
        mercuryJwt: import.meta.env.VITE_mercuryJwt,
      });

      const sac = new SACClient({
        rpcUrl: import.meta.env.VITE_rpcUrl,
        networkPassphrase: import.meta.env.VITE_networkPassphrase,
      });

      // Just simulate a simple connection for now
      const native = sac.getSACClient(import.meta.env.VITE_nativeContractId);
      if (native) {
        setIsConnected(true);
        console.log('Wallet connected!');
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <PasskeyContext.Provider value={{ isConnected, connect }}>
      {children}
    </PasskeyContext.Provider>
  );
};
