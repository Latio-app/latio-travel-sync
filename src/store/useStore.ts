import { create } from "zustand";
import {
  User,
  WalletBalance,
  Transaction,
  TravelPlan,
  Recommendation,
} from "@/@types";

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;

  // Wallet state
  walletBalance: WalletBalance | null;
  transactions: Transaction[];

  // Travel state
  travelPlans: TravelPlan[];
  activeTravelPlan: TravelPlan | null;

  // Recommendations state
  recommendations: Recommendation[];

  // App state
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setWalletBalance: (balance: WalletBalance) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setTravelPlans: (plans: TravelPlan[]) => void;
  setActiveTravelPlan: (plan: TravelPlan | null) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  walletBalance: null,
  transactions: [],
  travelPlans: [],
  activeTravelPlan: null,
  recommendations: [],
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  setWalletBalance: (walletBalance) => set({ walletBalance }),
  setTransactions: (transactions) => set({ transactions }),
  setTravelPlans: (travelPlans) => set({ travelPlans }),
  setActiveTravelPlan: (activeTravelPlan) => set({ activeTravelPlan }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
