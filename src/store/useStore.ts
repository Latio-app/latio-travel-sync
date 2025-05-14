import { create } from "zustand";

interface WalletState {
  walletAddress: string | null;
  contractId: string | null;
  balanceXLM: string | null;
  setWalletData: (address: string, contractId: string, balance: string) => void;
  resetWalletData: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  walletAddress: null,
  contractId: null,
  balanceXLM: null,

  setWalletData: (address, contractId, balance) =>
    set({ walletAddress: address, contractId, balanceXLM: balance }),

  resetWalletData: () =>
    set({ walletAddress: null, contractId: null, balanceXLM: null }),
}));
