import { Server } from "@stellar/stellar-sdk/rpc";
import { PasskeyKit, SACClient } from "passkey-kit";
import type { Tx } from "@stellar/stellar-sdk/contract";

const {
  VITE_STELLAR_RPC_URL,
  VITE_STELLAR_NETWORK_PASSPHRASE,
  VITE_WALLET_WASM_HASH,
  VITE_NATIVE_CONTRACT_ADDRESS,
} = import.meta.env;

export const rpc = new Server(VITE_STELLAR_RPC_URL);

export const account = new PasskeyKit({
  rpcUrl: VITE_STELLAR_RPC_URL,
  networkPassphrase: VITE_STELLAR_NETWORK_PASSPHRASE,
  walletWasmHash: VITE_WALLET_WASM_HASH,
  timeoutInSeconds: 30,
});

export const sac = new SACClient({
  rpcUrl: VITE_STELLAR_RPC_URL,
  networkPassphrase: VITE_STELLAR_NETWORK_PASSPHRASE,
});

export const native = sac.getSACClient(VITE_NATIVE_CONTRACT_ADDRESS);

export const connectWallet = async () => {
  try {
    const wallet = await (account as any).authenticate();
    console.log("✅ Wallet Connected:", wallet.publicKey);
    return wallet;
  } catch (error) {
    console.error("❌ Connection Error:", error);
    throw error;
  }
};

/**
 * Send Transaction to Backend for Signing
 */
export async function send(tx: Tx) {
  return fetch("/api/send", {
    method: "POST",
    body: JSON.stringify({
      xdr: tx.toXDR(),
    }),
  }).then(async (res) => {
    if (res.ok) return res.json();
    else throw await res.text();
  });
}

/**
 * Get the Contract ID associated with a Signer
 */
export async function getContractId(signer: string) {
  return fetch(`/api/contract/${signer}`).then(async (res) => {
    if (res.ok) return res.text();
    else throw await res.text();
  });
}

/**
 * Fund the Contract Wallet
 */
export async function fundContract(address: string) {
  return fetch(`/api/fund/${address}`).then(async (res) => {
    if (res.ok) return res.json();
    else throw await res.text();
  });
}
