import { create } from "zustand";

interface UserState {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  walletAddress: null,
  setWalletAddress: (address) => set({ walletAddress: address }),
}));
