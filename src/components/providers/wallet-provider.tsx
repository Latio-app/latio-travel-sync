import { createContext, useContext, useEffect, useState } from "react";
import {
  passkey,
  connectWallet,
  syncWallet as syncWalletPasskey,
} from "@/lib/passkey";

type WalletProviderProps = {
  children: React.ReactNode;
};

type WalletProviderState = {
  isConnected: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  syncWallet: () => Promise<void>;
};

const initialState: WalletProviderState = {
  isConnected: false,
  publicKey: null,
  connect: async () => {},
  disconnect: () => {},
  syncWallet: async () => {},
};

const WalletProviderContext = createContext<WalletProviderState>(initialState);

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    // Check if already connected
    const storedPublicKey = localStorage.getItem("wallet-public-key");
    if (storedPublicKey) {
      setPublicKey(storedPublicKey);
      setIsConnected(true);
    }
  }, []);

  const connect = async () => {
    try {
      const account = await connectWallet();
      setPublicKey(account.publicKey);
      setIsConnected(true);
      localStorage.setItem("wallet-public-key", account.publicKey);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    setIsConnected(false);
    localStorage.removeItem("wallet-public-key");
  };

  const syncWallet = async () => {
    if (!publicKey) return;

    try {
      await syncWalletPasskey(publicKey);
      console.log("🔄 Wallet Synced");
    } catch (error) {
      console.error("Failed to sync wallet:", error);
      throw error;
    }
  };

  const value = {
    isConnected,
    publicKey,
    connect,
    disconnect,
    syncWallet,
  };

  return (
    <WalletProviderContext.Provider value={value}>
      {children}
    </WalletProviderContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletProviderContext);

  if (context === undefined)
    throw new Error("useWallet must be used within a WalletProvider");

  return context;
};
