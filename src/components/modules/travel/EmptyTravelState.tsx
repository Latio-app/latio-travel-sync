import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyTravelStateProps {
  message: string;
  onCreateNew?: () => void;
}

const EmptyTravelState = ({ message, onCreateNew }: EmptyTravelStateProps) => (
  <Card className="text-center py-12 max-w-md mx-auto">
    <div className="bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        className="h-8 w-8 text-latio-blue"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    </div>
    <p className="text-gray-500 mb-4">{message}</p>
    <Button onClick={onCreateNew} className="bg-latio-blue hover:bg-blue-600">
      <Plus className="h-4 w-4 mr-2" />
      Create Travel Plan
    </Button>
  </Card>
);

export default EmptyTravelState;
