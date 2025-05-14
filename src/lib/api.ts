import {
  User,
  WalletBalance,
  Transaction,
  TravelPlan,
  Recommendation,
} from "@/@types";

// Base API URL - would typically come from environment variables
const API_BASE_URL = "/api";

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: Record<string, unknown>
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for auth
  };

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }

  return response.json();
}

// Authentication APIs
export const authAPI = {
  login: (walletAddress: string) =>
    fetchAPI<{ user: User }>("/auth/login", "POST", { walletAddress }),
  logout: () => fetchAPI<{ success: boolean }>("/auth/logout", "POST"),
  getUser: () => fetchAPI<{ user: User }>("/auth/user", "GET"),
};

// Wallet APIs
export const walletAPI = {
  getBalance: (userId: string) =>
    fetchAPI<{ balance: WalletBalance }>(
      `/wallet/getBalance?userId=${userId}`,
      "GET"
    ),
  syncWallet: (userId: string) =>
    fetchAPI<{ balance: WalletBalance }>(
      `/wallet/sync?userId=${userId}`,
      "GET"
    ),
};

// Transaction APIs
export const transactionAPI = {
  createTransaction: (transaction: Partial<Transaction>) =>
    fetchAPI<{ transaction: Transaction }>(
      "/transaction/create",
      "POST",
      transaction
    ),
  getTransactions: (userId: string) =>
    fetchAPI<{ transactions: Transaction[] }>(
      `/transaction/fetch?userId=${userId}`,
      "GET"
    ),
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) =>
    fetchAPI<{ transaction: Transaction }>("/transaction/update", "PUT", {
      id: transactionId,
      ...updates,
    }),
};

// Travel APIs
export const travelAPI = {
  createTravel: (travelPlan: Partial<TravelPlan>) =>
    fetchAPI<{ travel: TravelPlan }>("/travel/create", "POST", travelPlan),
  getTravelPlans: (userId: string) =>
    fetchAPI<{ travelPlans: TravelPlan[] }>(
      `/travel/fetch?userId=${userId}`,
      "GET"
    ),
  updateTravel: (travelId: string, updates: Partial<TravelPlan>) =>
    fetchAPI<{ travel: TravelPlan }>("/travel/update", "PUT", {
      id: travelId,
      ...updates,
    }),
};

// Recommendations APIs
export const recommendationsAPI = {
  getRecommendations: (location: string, budget: number) =>
    fetchAPI<{ recommendations: Recommendation[] }>(
      `/recommendations/get?location=${location}&budget=${budget}`,
      "GET"
    ),
  updateRecommendation: (recommendationId: string, feedback: string) =>
    fetchAPI<{ success: boolean }>("/recommendations/update", "PUT", {
      id: recommendationId,
      feedback,
    }),
};
