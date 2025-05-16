import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AIRecommendation {
  id: string;
  prompt: string;
  response: string;
  location: string;
  type: "travel" | "price";
  metadata?: {
    budget?: number;
    duration?: number;
    preferences?: string[];
  };
  timestamp: Timestamp;
}

export const getAIRecommendations = async (
  userId: string,
  travelId: string
): Promise<AIRecommendation[]> => {
  try {
    const recommendationsRef = collection(db, "aiRecommendations");
    const q = query(
      recommendationsRef,
      where("userId", "==", userId),
      where("travelId", "==", travelId)
    );

    const querySnapshot = await getDocs(q);
    const recommendations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AIRecommendation[];

    return recommendations.sort(
      (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()
    );
  } catch (error) {
    console.error("Error fetching AI recommendations:", error);
    throw error;
  }
};

export const addAIRecommendation = async (
  userId: string,
  travelId: string,
  recommendation: Omit<AIRecommendation, "id" | "timestamp">
): Promise<AIRecommendation> => {
  try {
    const recommendationsRef = collection(db, "aiRecommendations");
    const docRef = await addDoc(recommendationsRef, {
      ...recommendation,
      userId,
      travelId,
      timestamp: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...recommendation,
      timestamp: Timestamp.now(),
    };
  } catch (error) {
    console.error("Error adding AI recommendation:", error);
    throw error;
  }
};
