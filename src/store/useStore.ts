import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PasskeyKit } from "passkey-kit";
import { Server } from "@stellar/stellar-sdk/rpc";
interface WalletState {
  walletAddress: string | null;
  contractId: string | null;
  balanceXLM: string | null;
  loading: boolean;
  connected: boolean;
  error: string | null;
  connectWallet: (app: string, user: string) => Promise<void>;
  disconnectWallet: () => void;
  loadWalletFromStorage: () => void;
}

const rpc = new Server(import.meta.env.VITE_rpcUrl);

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      walletAddress: null,
      contractId: null,
      balanceXLM: null,
      loading: false,
      connected: false,
      error: null,

      connectWallet: async (app, user) => {
        if (!app || !user) {
          console.error("❌ Missing app or user parameter.");
          return;
        }

        set({ loading: true, error: null });

        try {
          const account = new PasskeyKit({
            rpcUrl: import.meta.env.VITE_rpcUrl,
            networkPassphrase: import.meta.env.VITE_networkPassphrase,
            walletWasmHash: import.meta.env.VITE_walletWasmHash,
          });

          const response = await account.createWallet(app, user);

          if (response.contractId && response.contractId.length === 56) {
            console.log(
              `✅ Wallet created! Contract ID: ${response.contractId}`
            );

            set({
              walletAddress: response.contractId,
              contractId: response.contractId,
              connected: true,
              loading: false,
            });

            const accountData = await rpc.getAccount(response.contractId);

            // ✅ **Set the Balance**
            // set({
            //   balanceXLM:
            //     accountData.balances.find((b) => b.asset_type === "native")
            //       ?.balance ?? "0",
            // });
          } else {
            throw new Error("Invalid Contract ID returned.");
          }
        } catch (error: any) {
          console.error("❌ Connection failed:", error.message);
          set({ loading: false, connected: false, error: error.message });
        }
      },

      // 🔌 **Disconnect Wallet Logic**
      disconnectWallet: () => {
        set({
          walletAddress: null,
          contractId: null,
          balanceXLM: null,
          connected: false,
          loading: false,
          error: null,
        });
      },

      // ♻️ **Load Wallet from Storage Logic**
      loadWalletFromStorage: () => {
        // 👇 Zustand persist automatically saves to localStorage
        const storedData = JSON.parse(
          localStorage.getItem("zustand_wallet") || "{}"
        );
        if (storedData && storedData.state) {
          const { walletAddress, contractId, balanceXLM, connected } =
            storedData.state;
          set({
            walletAddress,
            contractId,
            balanceXLM,
            connected,
          });
          console.log("✅ State restored from localStorage");
        }
      },
    }),
    {
      name: "zustand_wallet",
      partialize: (state) => ({
        walletAddress: state.walletAddress,
        contractId: state.contractId,
        balanceXLM: state.balanceXLM,
        connected: state.connected,
      }),
    }
  )
);
