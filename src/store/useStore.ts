import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PasskeyKit, SACClient, PasskeyServer } from "passkey-kit";
import { Server } from "@stellar/stellar-sdk/rpc";
import { xdr } from "@stellar/stellar-sdk";

interface WalletState {
  walletAddress: string | null;
  contractId: string | null;
  balanceXLM: string | null;
  loading: boolean;
  connected: boolean;
  error: string | null;
  showRegisterModal: boolean;
  connectWallet: (app: string, user: string) => Promise<void>;
  signUpWallet: (app: string, user: string) => Promise<void>;
  signInWallet: () => Promise<void>;
  disconnectWallet: () => void;
  loadWalletFromStorage: () => void;
  fetchBalance: () => Promise<void>;
  fundWallet: () => Promise<void>;
  setShowRegisterModal: (show: boolean) => void;
}

const rpc = new Server(import.meta.env.VITE_rpcUrl);

// 🌟 Initialize SACClient for XLM (Native) transfers
const sac = new SACClient({
  rpcUrl: import.meta.env.VITE_rpcUrl,
  networkPassphrase: import.meta.env.VITE_networkPassphrase,
});

const native = sac.getSACClient(import.meta.env.VITE_nativeContractId);

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      walletAddress: null,
      contractId: null,
      balanceXLM: null,
      loading: false,
      connected: false,
      error: null,
      showRegisterModal: false,

      /**
       * ✅ Connect to Wallet (existing or new)
       */
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

          // ✅ Initialize the server
          const server = new PasskeyServer({
            rpcUrl: import.meta.env.VITE_rpcUrl,
            launchtubeUrl: import.meta.env.VITE_launchtubeUrl,
            launchtubeJwt: import.meta.env.VITE_launchtubeJwt,
            mercuryUrl: import.meta.env.VITE_mercuryUrl,
            mercuryJwt: import.meta.env.VITE_mercuryJwt,
          });

          // ✅ 1️⃣ Check if a wallet already exists in localStorage
          const storedKeyId = localStorage.getItem("sp:keyId");
          const storedContractId = localStorage.getItem("sp:contractId");

          if (storedKeyId && storedContractId) {
            console.log("🔓 Found existing wallet. Connecting...");

            // ✅ 2️⃣ Connect to existing wallet
            const { keyId, contractId } = await account.connectWallet({
              keyId: storedKeyId,
              getContractId: (keyId) => server.getContractId({ keyId }),
            });

            console.log(`✅ Wallet Connected: ${contractId}`);

            set({
              walletAddress: contractId,
              contractId,
              connected: true,
              loading: false,
            });

            await get().fetchBalance();
          } else {
            console.log("🆕 No existing wallet found. Creating a new one...");

            // ✅ 3️⃣ Create a new wallet
            const response = await account.createWallet(app, user);

            if (response.contractId && response.keyId) {
              console.log(
                `✅ New Wallet created! Contract ID: ${response.contractId}`
              );

              // ✅ 4️⃣ Store in localStorage for future use
              localStorage.setItem("sp:keyId", response.keyIdBase64); // <== Corrected
              localStorage.setItem("sp:contractId", response.contractId);

              set({
                walletAddress: response.contractId,
                contractId: response.contractId,
                connected: true,
                loading: false,
              });

              await get().fetchBalance();
            } else {
              throw new Error("Invalid Contract ID returned.");
            }
          }
        } catch (error: any) {
          console.error("❌ Connection failed:", error.message);
          set({ loading: false, connected: false, error: error.message });
        }
      },

      signUpWallet: async (app, user) => {
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

          console.log("🆕 Creating a new wallet...");

          // ✅ 1️⃣ Create a new wallet
          const response = await account.createWallet(app, user);

          if (response.contractId && response.keyIdBase64) {
            console.log(
              `✅ New Wallet created! Contract ID: ${response.contractId}`
            );

            // ✅ 2️⃣ Store in localStorage for future use
            localStorage.setItem("sp:keyId", response.keyIdBase64);
            localStorage.setItem("sp:contractId", response.contractId);

            set({
              walletAddress: response.contractId,
              contractId: response.contractId,
              connected: true,
              loading: false,
            });

            await get().fetchBalance();
          } else {
            throw new Error("Invalid Contract ID returned.");
          }
        } catch (error: any) {
          console.error("❌ Wallet creation failed:", error.message);
          set({ loading: false, connected: false, error: error.message });
        }
      },

      /**
       * ✅ Sign In (Only Connects to Existing Wallet)
       */
      signInWallet: async () => {
        try {
          const storedKeyId = localStorage.getItem("sp:keyId");
          const storedContractId = localStorage.getItem("sp:contractId");

          if (storedKeyId && storedContractId) {
            console.log("🔓 Found existing wallet. Connecting...");

            const account = new PasskeyKit({
              rpcUrl: import.meta.env.VITE_rpcUrl,
              networkPassphrase: import.meta.env.VITE_networkPassphrase,
              walletWasmHash: import.meta.env.VITE_walletWasmHash,
            });

            const server = new PasskeyServer({
              rpcUrl: import.meta.env.VITE_rpcUrl,
              launchtubeUrl: import.meta.env.VITE_launchtubeUrl,
              launchtubeJwt: import.meta.env.VITE_launchtubeJwt,
              mercuryUrl: import.meta.env.VITE_mercuryUrl,
              mercuryJwt: import.meta.env.VITE_mercuryJwt,
            });

            // ✅ Connect to existing wallet
            const { contractId } = await account.connectWallet({
              keyId: storedKeyId,
              getContractId: (keyId) => server.getContractId({ keyId }),
            });

            console.log(`✅ Wallet Connected: ${contractId}`);

            set({
              walletAddress: contractId,
              contractId,
              connected: true,
              loading: false,
            });

            await get().fetchBalance();
          } else {
            console.error("❌ No wallet found in local storage.");
            set({
              loading: false,
              connected: false,
              error: "No wallet found.",
            });
          }
        } catch (error: any) {
          console.error("❌ Connection failed:", error.message);
          set({ loading: false, connected: false, error: error.message });
        }
      },
      /**
       * ✅ Fetch Balance from the contract
       */
      fetchBalance: async () => {
        try {
          const { result } = await native.balance({
            id: get().contractId!,
          });

          console.log("🔍 Wallet Balance:", result.toString());
          set({ balanceXLM: result.toString() });
        } catch (error) {
          console.error("❌ Failed to fetch balance:", error.message);
        }
      },

      /**
       * 💸 Fund the wallet with 10 XLM for testing
       */
      fundWallet: async () => {
        try {
          await rpc.requestAirdrop(get().contractId!, "10");
          console.log("💸 10 XLM Airdropped!");
          await get().fetchBalance();
        } catch (error) {
          console.error("❌ Airdrop failed:", error.message);
        }
      },

      /**
       * 🔌 Disconnect the wallet and clear state
       */
      disconnectWallet: () => {
        console.log("🔌 Disconnecting Wallet...");
        localStorage.removeItem("sp:keyId");
        localStorage.removeItem("sp:contractId");

        set({
          walletAddress: null,
          contractId: null,
          balanceXLM: null,
          connected: false,
          loading: false,
          error: null,
          showRegisterModal: false,
        });
      },

      /**
       * ♻️ Load the wallet from localStorage if it exists
       */
      loadWalletFromStorage: () => {
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

      /**
       * 🛠️ Show or hide the registration modal
       */
      setShowRegisterModal: (show: boolean) => {
        set({ showRegisterModal: show });
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
