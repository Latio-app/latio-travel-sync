import { useTravelPlans } from "@/hooks/useTravelPlans";
import { useTravelStore } from "@/store/useTravelStore";
import { useWalletStore } from "@/store/useStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const TravelSelector = () => {
  const { walletAddress } = useWalletStore();
  const { travelPlans, isLoading } = useTravelPlans(walletAddress);
  const { selectedTravelId, setSelectedTravelId } = useTravelStore();

  if (isLoading) {
    return (
      <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="travel-select">Select a Travel Plan</Label>
      <Select
        value={selectedTravelId || ""}
        onValueChange={setSelectedTravelId}
      >
        <SelectTrigger id="travel-select" className="w-full">
          <SelectValue placeholder="Select a travel plan" />
        </SelectTrigger>
        <SelectContent>
          {travelPlans.map((travel) => (
            <SelectItem key={travel.id} value={travel.id}>
              {travel.title} — {travel.destination}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TravelSelector;
