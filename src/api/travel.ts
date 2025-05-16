import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { TravelPlan } from "@/types/travel";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface BlockedError extends Error {
  message: string;
}

const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    const blockedError = error as BlockedError;
    if (
      blockedError?.message?.includes("ERR_BLOCKED_BY_CLIENT") &&
      retries > 0
    ) {
      await sleep(RETRY_DELAY);
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
};

export const fetchTravelPlans = async (
  userId: string
): Promise<TravelPlan[]> => {
  if (!userId) {
    console.error("No userId provided to fetchTravelPlans");
    return [];
  }

  return retryOperation(async () => {
    const travelRef = collection(db, "users", userId, "travel");
    const snapshot = await getDocs(travelRef);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as TravelPlan
    );
  });
};

export const createTravelPlan = async (
  userId: string,
  plan: Omit<TravelPlan, "id" | "createdAt" | "updatedAt">
) => {
  console.log(userId);
  if (!userId) {
    throw new Error("No userId provided to createTravelPlan");
  }

  return retryOperation(async () => {
    const travelRef = collection(db, "users", userId, "travel");
    const now = Timestamp.now().toDate().toISOString();

    const newPlan = {
      ...plan,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(travelRef, newPlan);
    return { id: docRef.id, ...newPlan };
  });
};

export const updateTravelPlan = async (
  userId: string,
  travelId: string,
  data: Partial<TravelPlan>
) => {
  if (!userId || !travelId) {
    throw new Error("Missing userId or travelId in updateTravelPlan");
  }

  return retryOperation(async () => {
    const travelRef = doc(db, "users", userId, "travel", travelId);
    await updateDoc(travelRef, data);
  });
};

export const deleteTravelPlan = async (userId: string, travelId: string) => {
  if (!userId || !travelId) {
    throw new Error("Missing userId or travelId in deleteTravelPlan");
  }

  return retryOperation(async () => {
    const travelRef = doc(db, "users", userId, "travel", travelId);
    await deleteDoc(travelRef);
  });
};

export const fetchTravelPlan = async (
  userId: string,
  travelId: string
): Promise<TravelPlan> => {
  if (!userId || !travelId) {
    throw new Error("Missing userId or travelId in fetchTravelPlan");
  }

  return retryOperation(async () => {
    const travelRef = doc(db, "users", userId, "travel", travelId);
    const snapshot = await getDoc(travelRef);

    if (!snapshot.exists()) {
      throw new Error("Travel plan not found");
    }

    return { id: snapshot.id, ...snapshot.data() } as TravelPlan;
  });
};

export const subscribeToTravelPlan = (
  userId: string,
  travelId: string,
  callback: (travelPlan: TravelPlan) => void
) => {
  const travelRef = doc(db, "users", userId, "travel", travelId);

  try {
    return onSnapshot(
      travelRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback({ id: snapshot.id, ...snapshot.data() } as TravelPlan);
        }
      },
      (error) => {
        console.warn("Error in travel plan subscription:", error);
        setTimeout(() => {
          subscribeToTravelPlan(userId, travelId, callback);
        }, RETRY_DELAY);
      }
    );
  } catch (error) {
    console.warn("Error setting up travel plan subscription:", error);
    return () => {};
  }
};

export const updateAIRecommendations = async (
  userId: string,
  travelId: string,
  recommendations: TravelPlan["aiRecommendations"]
) => {
  return retryOperation(async () => {
    const travelRef = doc(
      db,
      "users",
      "CCIGAE2V6HR36I2CMLG47LPZFGSHPTRGYCFTH267M5D7ZXJHU4B5EF6R",
      "travel",
      travelId
    );
    await updateDoc(travelRef, { aiRecommendations: recommendations });
  });
};

export const updateBudget = async (
  userId: string,
  travelId: string,
  budget: TravelPlan["budget"]
) => {
  return retryOperation(async () => {
    const travelRef = doc(
      db,
      "users",
      "CCIGAE2V6HR36I2CMLG47LPZFGSHPTRGYCFTH267M5D7ZXJHU4B5EF6R",
      "travel",
      travelId
    );
    await updateDoc(travelRef, { budget });
  });
};

export const updateStipend = async (
  userId: string,
  travelId: string,
  stipend: TravelPlan["stipend"]
) => {
  return retryOperation(async () => {
    const travelRef = doc(
      db,
      "users",
      "CCIGAE2V6HR36I2CMLG47LPZFGSHPTRGYCFTH267M5D7ZXJHU4B5EF6R",
      "travel",
      travelId
    );
    await updateDoc(travelRef, { stipend });
  });
};
