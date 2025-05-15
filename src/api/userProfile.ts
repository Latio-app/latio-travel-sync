import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  UserProfile,
  CreateUserProfileDTO,
  UpdateUserProfileDTO,
} from "@/types/user";

const COLLECTION_NAME = "users";

export const createUserProfile = async (
  data: CreateUserProfileDTO
): Promise<void> => {
  const userRef = doc(db, COLLECTION_NAME, data.userId);
  const userData: Omit<UserProfile, "userId"> = {
    walletAddress: data.walletAddress,
    contractId: data.contractId,
    email: data.email,
    balanceXLM: "0",
    createdAt: serverTimestamp() as unknown as Date,
    lastLogin: serverTimestamp() as unknown as Date,
    isDeleted: false,
  };

  await setDoc(userRef, userData);
};

export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, COLLECTION_NAME, userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  const data = userSnap.data();
  return {
    userId,
    ...data,
    createdAt: (data.createdAt as Timestamp).toDate(),
    lastLogin: (data.lastLogin as Timestamp).toDate(),
  } as UserProfile;
};

export const updateUserProfile = async (
  userId: string,
  data: UpdateUserProfileDTO
): Promise<void> => {
  const userRef = doc(db, COLLECTION_NAME, userId);
  const updateData: Partial<UserProfile> = {
    ...data,
    lastLogin: data.lastLogin || (serverTimestamp() as unknown as Date),
  };

  await updateDoc(userRef, updateData);
};

export const deleteUserProfile = async (userId: string): Promise<void> => {
  const userRef = doc(db, COLLECTION_NAME, userId);
  await updateDoc(userRef, { isDeleted: true });
};
