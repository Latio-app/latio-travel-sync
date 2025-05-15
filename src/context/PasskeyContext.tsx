import React, { createContext, useContext, useState } from "react";
import { PasskeyKit, PasskeyServer, SACClient } from "passkey-kit";
import { Server } from "@stellar/stellar-sdk/minimal/rpc";

interface PasskeyContextProps {
  isConnected: boolean;
  publicKey: string | null;
  connect: () => void;
}

const PasskeyContext = createContext<PasskeyContextProps | null>(null);

export const usePasskey = () => useContext(PasskeyContext)!;

export const PasskeyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const connect = async () => {
    try {
      const rpc = new Server(import.meta.env.VITE_rpcUrl);

      const account = new PasskeyKit({
        rpcUrl: import.meta.env.VITE_rpcUrl,
        networkPassphrase: import.meta.env.VITE_networkPassphrase,
        walletWasmHash: import.meta.env.VITE_walletWasmHash,
      });

      const app = "my-stellar-app";
      const user = "user@example.com";

      console.log(`Creating wallet for App: ${app} and User: ${user}`);

      const response = await account.createWallet(app, user);

      if (response.contractId) {
        console.log(
          `Wallet created successfully! Contract ID: ${response.contractId}`
        );
        setPublicKey(response.contractId);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <PasskeyContext.Provider value={{ isConnected, publicKey, connect }}>
      {children}
    </PasskeyContext.Provider>
  );
};
