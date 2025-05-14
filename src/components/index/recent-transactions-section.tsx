import React from "react";
import { Button } from "@/components/ui/button";
import TransactionList from "@/components/transactions/transaction-list";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: string;
  amount: number;
  asset: string;
  type: "send" | "receive";
  description: string;
  recipient: string;
  status: "completed" | "pending" | "failed";
  timestamp: string;
  txHash: string;
  _base: Record<string, any>;
}

interface RecentTransactionsSectionProps {
  transactions: Transaction[];
}

export const RecentTransactionsSection = ({
  transactions,
}: RecentTransactionsSectionProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="md:col-span-2 animate-fade-in"
      style={{ animationDelay: "100ms" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Transactions
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-latio-blue hover:text-latio-blue hover:bg-blue-50"
          onClick={() => navigate("/transactions")}
        >
          View All
        </Button>
      </div>
      <TransactionList transactions={transactions} />
    </div>
  );
};
