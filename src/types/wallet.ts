export interface Transaction {
  id: string;
  type: "send" | "receive";
  amount: string;
  destination: string;
  memo?: string;
  timestamp: string;
  travelId?: string;
  status: "success" | "pending" | "failed";
}
