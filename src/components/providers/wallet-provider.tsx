import { createContext, useContext, useEffect, useState } from "react";
import { PasskeyKit } from "passkey-kit";

type WalletProviderProps = {
  children: React.ReactNode;
};

type WalletProviderState = {
  passkeyKit: PasskeyKit | null;
  isConnected: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const initialState: WalletProviderState = {
  passkeyKit: null,
  isConnected: false,
  publicKey: null,
  connect: async () => {},
  disconnect: () => {},
};

const WalletProviderContext = createContext<WalletProviderState>(initialState);

export function WalletProvider({ children }: WalletProviderProps) {
  const [passkeyKit, setPasskeyKit] = useState<PasskeyKit | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    const initPasskeyKit = async () => {
      const kit = new PasskeyKit({
        network: "testnet", // or "public" for mainnet
        rpcUrl: "https://soroban-testnet.stellar.org", // or mainnet URL
      });
      setPasskeyKit(kit);

      // Check if already connected
      const storedPublicKey = localStorage.getItem("wallet-public-key");
      if (storedPublicKey) {
        setPublicKey(storedPublicKey);
        setIsConnected(true);
      }
    };

    initPasskeyKit();
  }, []);

  const connect = async () => {
    if (!passkeyKit) return;

    try {
      const { publicKey: newPublicKey } = await passkeyKit.connect();
      setPublicKey(newPublicKey);
      setIsConnected(true);
      localStorage.setItem("wallet-public-key", newPublicKey);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    setIsConnected(false);
    localStorage.removeItem("wallet-public-key");
  };

  const value = {
    passkeyKit,
    isConnected,
    publicKey,
    connect,
    disconnect,
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
