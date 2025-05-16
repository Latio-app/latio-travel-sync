import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Transaction } from "@/types/wallet";

const TRANSACTIONS_COLLECTION = "transactions";

export const createTransaction = async (
  walletAddress: string,
  transaction: Omit<Transaction, "id">
): Promise<Transaction> => {
  const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
    ...transaction,
    type: "send", // Default to send for new transactions
    walletAddress,
    timestamp: new Date().toISOString(),
  });

  return {
    id: docRef.id,
    ...transaction,
    type: "send", // Ensure type is included in the returned transaction
  } as Transaction;
};

export const getTransactions = async (walletAddress: string) => {
  const q = query(
    collection(db, TRANSACTIONS_COLLECTION),
    where("walletAddress", "==", walletAddress),
    orderBy("timestamp", "desc"),
    limit(50)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Transaction[];
};

export const updateTransaction = async (
  id: string,
  updates: Partial<Transaction>
) => {
  const docRef = doc(db, TRANSACTIONS_COLLECTION, id);
  await updateDoc(docRef, updates);
};

export const deleteTransaction = async (
  userId: string,
  transactionId: string
): Promise<void> => {
  const transactionRef = doc(
    db,
    "users",
    userId,
    "transactions",
    transactionId
  );
  await deleteDoc(transactionRef);
};

export const assignTransactionToTravel = async (
  userId: string,
  transactionId: string,
  travelId: string
): Promise<void> => {
  await updateTransaction(transactionId, { travelId });
};
