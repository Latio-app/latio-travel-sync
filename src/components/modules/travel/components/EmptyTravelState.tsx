import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyTravelStateProps {
  onCreateNew: () => void;
}

const EmptyTravelState = ({ onCreateNew }: EmptyTravelStateProps) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Travel Plans Yet
      </h3>
      <p className="text-gray-600 mb-6">
        Create your first travel plan to get started
      </p>
      <Button onClick={onCreateNew} className="bg-latio-blue hover:bg-blue-600">
        <Plus className="h-4 w-4 mr-2" />
        New Travel Plan
      </Button>
    </div>
  );
};

export default EmptyTravelState;
