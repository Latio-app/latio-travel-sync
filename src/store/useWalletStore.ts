import { create } from "zustand";
import {
  getStellarBalance,
  fetchTransactionHistory,
} from "@/api/stellarContract";
import {
  getTransactions,
  createTransaction,
  updateTransaction as updateFirestoreTransaction,
} from "@/api/firestoreTransactions";
import { Transaction } from "@/types/wallet";

interface WalletState {
  publicKey: string | null;
  balance: string;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  setPublicKey: (key: string | null) => void;
  setBalance: (balance: string) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (
    id: string,
    updates: Partial<Transaction>
  ) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  publicKey: null,
  balance: "0",
  transactions: [],
  isLoading: false,
  error: null,

  setPublicKey: (key) => {
    set({ publicKey: key });
    if (key) {
      get().fetchBalance();
      get().fetchTransactions();
    }
  },

  setBalance: (balance) => set({ balance }),
  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  updateTransaction: async (id, updates) => {
    try {
      await updateFirestoreTransaction(id, updates);
      set((state) => ({
        transactions: state.transactions.map((tx) =>
          tx.id === id ? { ...tx, ...updates } : tx
        ),
      }));
    } catch (error) {
      set({ error: "Failed to update transaction" });
      throw error;
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  fetchBalance: async () => {
    const { publicKey } = get();
    if (!publicKey) return;

    set({ isLoading: true, error: null });
    try {
      const balances = await getStellarBalance(publicKey);
      const nativeBalance =
        balances.find((b) => b.asset_type === "native")?.balance || "0";
      set({ balance: nativeBalance });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch balance",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTransactions: async () => {
    const { publicKey } = get();
    if (!publicKey) return;

    set({ isLoading: true, error: null });
    try {
      const [stellarTxs, firestoreTxs] = await Promise.all([
        fetchTransactionHistory(publicKey),
        getTransactions(publicKey),
      ]);

      // Merge and deduplicate transactions
      const allTxs = [...stellarTxs, ...firestoreTxs];
      const uniqueTxs = Array.from(
        new Map(allTxs.map((tx) => [tx.id, tx])).values()
      );

      set({ transactions: uniqueTxs });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch transactions",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
