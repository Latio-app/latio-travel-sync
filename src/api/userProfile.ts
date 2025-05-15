import {
  db,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  UserProfile,
} from "@/lib/firebase";

/**
 * 🔍 **Check if User Exists in Firestore**
 */
export const checkIfUserExists = async (
  passkeyId: string
): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", passkeyId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error("Error checking if user exists:", error);
    throw new Error("Failed to check if user exists");
  }
};

/**
 * ➕ **Create a New User in Firestore**
 */
export const createUserProfile = async (
  passkeyId: string,
  walletAddress: string,
  name: string,
  email: string
): Promise<void> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Check if user already exists
    const exists = await checkIfUserExists(passkeyId);
    if (exists) {
      throw new Error("User already exists");
    }

    const now = Timestamp.now();
    const userData: UserProfile = {
      profile: {
        name,
        email,
        walletAddress,
        passkeyId,
      },
      _base: {
        createdAt: now,
        updatedAt: now,
      },
      balances: {
        XLM: "0.00",
      },
      preferredCurrency: "USD",
    };

    const userRef = doc(db, "users", passkeyId);
    await setDoc(userRef, userData);
    console.log(`✅ User profile created for ${passkeyId}`);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};
