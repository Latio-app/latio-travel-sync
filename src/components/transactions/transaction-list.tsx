import { Transaction } from "@/@types";
import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Check,
  X,
  Clock,
} from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  className?: string;
}

const TransactionList = ({ transactions, className }: TransactionListProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "failed":
        return <X className="h-4 w-4 text-red-500" />;
      case "pending":
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case "receive":
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case "swap":
      default:
        return <RefreshCw className="h-5 w-5 text-latio-blue" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {transactions.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p>No transactions yet</p>
        </div>
      ) : (
        transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center p-3 border border-gray-100 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              {getTransactionIcon(transaction.type)}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">
                {transaction.type === "send"
                  ? `To: ${transaction.recipient}`
                  : transaction.type === "receive"
                    ? `From: ${transaction.recipient}`
                    : `Swap ${transaction.asset}`}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {transaction.description ||
                  transaction.travelReference ||
                  transaction.txHash.substring(0, 10) + "..."}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(transaction.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p
                className={cn(
                  "font-medium",
                  transaction.type === "send"
                    ? "text-red-500"
                    : transaction.type === "receive"
                      ? "text-green-500"
                      : "text-latio-blue"
                )}
              >
                {transaction.type === "send"
                  ? "-"
                  : transaction.type === "receive"
                    ? "+"
                    : ""}
                {transaction.amount} {transaction.asset}
              </p>
              <div className="flex items-center justify-end gap-1 mt-1">
                {getStatusIcon(transaction.status)}
                <span className="text-xs capitalize text-gray-500">
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionList;
