import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PasskeyKit, SACClient, PasskeyServer } from "passkey-kit";
import { Server } from "@stellar/stellar-sdk/rpc";
import { xdr } from "@stellar/stellar-sdk";
import { checkIfUserExists } from "@/api/userProfile";

interface WalletState {
  walletAddress: string | null;
  contractId: string | null;
  balanceXLM: string | null;
  loading: boolean;
  connected: boolean;
  error: string | null;
  showRegisterModal: boolean;
  passkeyId: string | null;
  isConnected: boolean;
  hasProfile: boolean;
  connectWallet: (app: string, user: string) => Promise<void>;
  signUpWallet: (app: string, user: string) => Promise<void>;
  signInWallet: () => Promise<void>;
  disconnectWallet: () => void;
  loadWalletFromStorage: () => void;
  fetchBalance: () => Promise<void>;
  fundWallet: () => Promise<void>;
  setShowRegisterModal: (show: boolean) => void;
  setHasProfile: (hasProfile: boolean) => void;
  checkUserProfile: () => Promise<void>;
}

const rpc = new Server(import.meta.env.VITE_rpcUrl);

// 🌟 Initialize SACClient for XLM (Native) transfers
const sac = new SACClient({
  rpcUrl: import.meta.env.VITE_rpcUrl,
  networkPassphrase: import.meta.env.VITE_networkPassphrase,
});

const native = sac.getSACClient(import.meta.env.VITE_nativeContractId);

const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      walletAddress: null,
      contractId: null,
      balanceXLM: null,
      loading: false,
      connected: false,
      error: null,
      showRegisterModal: false,
      passkeyId: null,
      isConnected: false,
      hasProfile: false,

      checkUserProfile: async () => {
        const passkeyId = get().passkeyId;
        if (!passkeyId) return;

        try {
          const exists = await checkIfUserExists(passkeyId);
          set({ hasProfile: exists, showRegisterModal: !exists });
          console.log("Profile check:", exists ? "Found" : "Not found");
        } catch (error) {
          console.error("Error checking profile:", error);
        }
      },

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

          const server = new PasskeyServer({
            rpcUrl: import.meta.env.VITE_rpcUrl,
            launchtubeUrl: import.meta.env.VITE_launchtubeUrl,
            launchtubeJwt: import.meta.env.VITE_launchtubeJwt,
            mercuryUrl: import.meta.env.VITE_mercuryUrl,
            mercuryJwt: import.meta.env.VITE_mercuryJwt,
          });

          const storedKeyId = localStorage.getItem("sp:keyId");
          const storedContractId = localStorage.getItem("sp:contractId");

          if (storedKeyId && storedContractId) {
            console.log("🔓 Found existing wallet. Connecting...");

            const { keyId, contractId } = await account.connectWallet({
              keyId: storedKeyId,
              getContractId: (keyId) => server.getContractId({ keyId }),
            });

            console.log(`✅ Wallet Connected: ${contractId}`);

            set({
              walletAddress: contractId,
              contractId,
              passkeyId: storedKeyId,
              connected: true,
              loading: false,
              isConnected: true,
            });

            await get().checkUserProfile();
            await get().fetchBalance();
          } else {
            console.log("🆕 No existing wallet found. Creating a new one...");

            const response = await account.createWallet(app, user);

            if (response.contractId && response.keyId) {
              console.log(
                `✅ New Wallet created! Contract ID: ${response.contractId}`
              );

              localStorage.setItem("sp:keyId", response.keyIdBase64);
              localStorage.setItem("sp:contractId", response.contractId);

              set({
                walletAddress: response.contractId,
                contractId: response.contractId,
                passkeyId: response.keyIdBase64,
                connected: true,
                loading: false,
                isConnected: true,
                showRegisterModal: true,
                hasProfile: false,
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

            const { contractId } = await account.connectWallet({
              keyId: storedKeyId,
              getContractId: (keyId) => server.getContractId({ keyId }),
            });

            console.log(`✅ Wallet Connected: ${contractId}`);

            set({
              walletAddress: contractId,
              contractId,
              passkeyId: storedKeyId,
              connected: true,
              loading: false,
              isConnected: true,
            });

            await get().checkUserProfile();
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
          passkeyId: null,
          isConnected: false,
          hasProfile: false,
        });
      },

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

      fundWallet: async () => {
        try {
          await rpc.requestAirdrop(get().contractId!, "10");
          console.log("💸 10 XLM Airdropped!");
          await get().fetchBalance();
        } catch (error) {
          console.error("❌ Airdrop failed:", error.message);
        }
      },

      setShowRegisterModal: (show: boolean) => {
        set({ showRegisterModal: show });
      },

      setHasProfile: (hasProfile: boolean) => {
        set({ hasProfile, showRegisterModal: !hasProfile });
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

          const response = await account.createWallet(app, user);

          if (response.contractId && response.keyIdBase64) {
            console.log(
              `✅ New Wallet created! Contract ID: ${response.contractId}`
            );

            localStorage.setItem("sp:keyId", response.keyIdBase64);
            localStorage.setItem("sp:contractId", response.contractId);

            set({
              walletAddress: response.contractId,
              contractId: response.contractId,
              passkeyId: response.keyIdBase64,
              connected: true,
              loading: false,
              isConnected: true,
              showRegisterModal: true,
              hasProfile: false,
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

      loadWalletFromStorage: () => {
        const storedData = JSON.parse(
          localStorage.getItem("zustand_wallet") || "{}"
        );
        if (storedData && storedData.state) {
          const {
            walletAddress,
            contractId,
            balanceXLM,
            connected,
            passkeyId,
            hasProfile,
          } = storedData.state;
          set({
            walletAddress,
            contractId,
            balanceXLM,
            connected,
            passkeyId,
            hasProfile,
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
        passkeyId: state.passkeyId,
        hasProfile: state.hasProfile,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("✅ State restored from localStorage");
        if (state?.passkeyId) {
          state.checkUserProfile();
        }
      },
    }
  )
);

export { useWalletStore };
