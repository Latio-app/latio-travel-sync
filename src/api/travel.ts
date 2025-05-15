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
} from "firebase/firestore";

export interface TravelPlan {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: "active" | "upcoming" | "past";
  createdAt: string;
  updatedAt: string;
}

export const fetchTravelPlans = async (userId: string) => {
  if (!userId) {
    console.error("No userId provided to fetchTravelPlans");
    return [];
  }

  try {
    const plansRef = collection(db, "users", userId, "travel");
    const q = query(plansRef, orderBy("startDate", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as TravelPlan
    );
  } catch (error) {
    console.error("Error fetching travel plans:", error);
    throw error;
  }
};

export const createTravelPlan = async (
  userId: string,
  plan: Omit<TravelPlan, "id" | "createdAt" | "updatedAt">
) => {
  if (!userId) {
    throw new Error("No userId provided to createTravelPlan");
  }

  try {
    console.log("Creating travel plan in Firestore:", { userId, plan });
    const plansRef = collection(db, "users", userId, "travel");
    const now = Timestamp.now().toDate().toISOString();

    const newPlan = {
      ...plan,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(plansRef, newPlan);
    console.log("Travel plan created with ID:", docRef.id);
    return { id: docRef.id, ...newPlan };
  } catch (error) {
    console.error("Error creating travel plan:", error);
    throw error;
  }
};

export const updateTravelPlan = async (
  userId: string,
  planId: string,
  updates: Partial<TravelPlan>
) => {
  if (!userId || !planId) {
    throw new Error("Missing userId or planId in updateTravelPlan");
  }

  try {
    const planRef = doc(db, "users", userId, "travel", planId);
    const now = Timestamp.now().toDate().toISOString();

    await updateDoc(planRef, {
      ...updates,
      updatedAt: now,
    });
  } catch (error) {
    console.error("Error updating travel plan:", error);
    throw error;
  }
};

export const deleteTravelPlan = async (userId: string, planId: string) => {
  if (!userId || !planId) {
    throw new Error("Missing userId or planId in deleteTravelPlan");
  }

  try {
    const planRef = doc(db, "users", userId, "travel", planId);
    await deleteDoc(planRef);
  } catch (error) {
    console.error("Error deleting travel plan:", error);
    throw error;
  }
};
