
export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  profile: {
    name: string;
    email: string;
    walletAddress: string;
    passKeyId: string;
    _base: Record<string, unknown>;
  };
}

export interface WalletBalance {
  xlm: number;
  preferredCurrency: string;
  localAmount: number;
}

export interface Transaction {
  id: string;
  amount: number;
  asset: string;
  type: 'send' | 'receive' | 'swap';
  travelReference?: string;
  description: string;
  recipient: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  txHash: string;
  _base: Record<string, unknown>;
}

export interface TravelPlan {
  id: string;
  title: string;
  destination: {
    city: string;
    country: string;
  };
  budget: {
    initial: number;
    spent: number;
    remaining: number;
  };
  stipend: {
    dailyLimit: number;
    currency: string;
  };
  startDate: string;
  endDate: string;
  _base: Record<string, unknown>;
}

export interface Recommendation {
  id: string;
  interactionId: string;
  prompt: string;
  response: string;
  timestamp: string;
  contextId: string;
  intent: string;
  _base: Record<string, unknown>;
}
