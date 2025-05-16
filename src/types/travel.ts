export interface TravelPlan {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: "active" | "upcoming" | "past";
  budget: {
    initial: number;
    spent: number;
    currency: string;
  };
  stipend?: {
    dailyLimit: number;
    currency: string;
    totalDays: number;
    totalAmount: number;
  };
  aiRecommendations?: {
    category: string;
    suggestions: string[];
  }[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TravelExpense {
  id: string;
  travelId: string;
  amount: number;
  description: string;
  category: string;
  date: number;
  userId: string;
  createdAt: number;
  updatedAt: number;
}
