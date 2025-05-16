import {
  Horizon,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
  Memo,
  Keypair,
} from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new Horizon.Server(HORIZON_URL);

interface PaymentParams {
  destination: string;
  amount: string;
  memo?: string;
}

export interface Transaction {
  id: string;
  type: "send" | "receive";
  amount: string;
  destination: string;
  timestamp: string;
  memo?: string;
  status: "pending" | "success" | "failed";
}

export interface Balance {
  balance: string;
  asset_type: string;
}

/**
 * ✅ **Send Payment through Stellar Network**
 */
export const sendStellarPayment = async (
  params: PaymentParams,
  walletAddress: string,
  secretKey: string
): Promise<Transaction> => {
  try {
    console.log(
      `🌐 Sending payment from ${walletAddress} to ${params.destination}`
    );

    // ✅ 1. Load the source account
    const sourceAccount = await server.loadAccount(walletAddress);
    const fee = await server.fetchBaseFee();

    // ✅ 2. Build the transaction
    const transactionBuilder = new TransactionBuilder(sourceAccount, {
      fee: fee.toString(),
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: params.destination,
          asset: Asset.native(),
          amount: params.amount,
        })
      )
      .setTimeout(30);

    // ✅ 3. Add Memo if present
    if (params.memo) {
      transactionBuilder.addMemo(Memo.text(params.memo));
    }

    // ✅ 4. Sign the transaction
    const transaction = transactionBuilder.build();
    const keypair = Keypair.fromSecret(secretKey);
    transaction.sign(keypair);

    // ✅ 5. Submit to Stellar network
    const result = await server.submitTransaction(transaction);

    console.log("✅ Transaction Successful: ", result.hash);

    // ✅ 6. Return formatted transaction
    return {
      id: result.hash,
      type: "send",
      amount: params.amount,
      destination: params.destination,
      timestamp: new Date().toISOString(),
      memo: params.memo,
      status: "success",
    };
  } catch (error) {
    console.error("❌ Error sending payment:", error.message);

    // 🔍 Enhanced error handling
    if (error.response && error.response.data) {
      console.error("📌 Detailed Error: ", error.response.data);
    }
    throw error;
  }
};

/**
 * ✅ **Get Wallet Balance**
 */
export const getStellarBalance = async (
  address: string
): Promise<Balance[]> => {
  try {
    const account = await server.loadAccount(address);

    // Extract all balances
    const balances = account.balances.map((balance) => ({
      balance: balance.balance,
      asset_type: balance.asset_type,
    }));

    console.log(`💰 Balance for ${address}:`, balances);
    return balances;
  } catch (error) {
    console.error("❌ Error fetching balance:", error.message);
    throw error;
  }
};

/**
 * ✅ **Fetch Stellar Transaction History**
 */
export const fetchTransactionHistory = async (
  address: string,
  limit: number = 10
): Promise<Transaction[]> => {
  try {
    console.log(`🔄 Fetching transaction history for ${address}`);
    const transactions = await server
      .transactions()
      .forAccount(address)
      .limit(limit)
      .order("desc")
      .call();

    const formattedTransactions: Transaction[] = [];

    for (const tx of transactions.records) {
      const operations = await tx.operations();
      for (const op of operations.records) {
        if (op.type === "payment") {
          formattedTransactions.push({
            id: tx.hash,
            type: op.from === address ? "send" : "receive",
            amount: op.amount,
            destination: op.to,
            timestamp: tx.created_at,
            memo: tx.memo,
            status: tx.successful ? "success" : "failed",
          });
        }
      }
    }

    console.log(`✅ Found ${formattedTransactions.length} transactions`);
    return formattedTransactions;
  } catch (error) {
    console.error("❌ Error fetching transaction history:", error.message);
    throw error;
  }
};
