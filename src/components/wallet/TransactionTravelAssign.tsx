import { useWalletStore } from "@/store/useWalletStore";
import { TravelPlan } from "@/types/travel";
import { Transaction } from "@/types/wallet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface TransactionTravelAssignProps {
  transaction: Transaction;
  travelPlans: TravelPlan[];
}

export const TransactionTravelAssign = ({
  transaction,
  travelPlans,
}: TransactionTravelAssignProps) => {
  const { updateTransaction } = useWalletStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTravelSelect = async (travelId: string) => {
    try {
      setIsUpdating(true);
      setError(null);
      await updateTransaction(transaction.id, {
        travelId: travelId || undefined,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update transaction"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-2">
      <Select
        value={transaction.travelId || ""}
        onValueChange={handleTravelSelect}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Associate with travel plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">None</SelectItem>
          {travelPlans.map((travel) => (
            <SelectItem key={travel.id} value={travel.id}>
              {travel.title} — {travel.destination}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};
