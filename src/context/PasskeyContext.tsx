import React, { createContext, useContext } from "react";
import { useWalletStore } from "@/store/useStore";

interface PasskeyContextProps {
  isConnected: boolean;
  publicKey: string | null;
  signIn: () => void;
  signUp: (app: string, user: string) => void;
  disconnect: () => void;
}

const PasskeyContext = createContext<PasskeyContextProps | null>(null);

export const usePasskey = () => useContext(PasskeyContext)!;

export const PasskeyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    connected,
    contractId,
    signInWallet,
    signUpWallet,
    disconnectWallet,
  } = useWalletStore();

  return (
    <PasskeyContext.Provider
      value={{
        isConnected: connected,
        publicKey: contractId,
        signIn: signInWallet,
        signUp: signUpWallet,
        disconnect: disconnectWallet,
      }}
    >
      {children}
    </PasskeyContext.Provider>
  );
};
