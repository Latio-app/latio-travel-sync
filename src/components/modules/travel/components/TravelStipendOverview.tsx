import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Stipend {
  dailyLimit: number;
  currency: string;
  totalDays: number;
  totalAmount: number;
}

interface TravelStipendOverviewProps {
  stipend?: Stipend;
  isLoading?: boolean;
}

const TravelStipendOverview = ({
  stipend,
  isLoading,
}: TravelStipendOverviewProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stipend Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stipend) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stipend Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No stipend information available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stipend Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily Limit</span>
              <span className="font-medium">
                {stipend.currency} {stipend.dailyLimit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Days</span>
              <span className="font-medium">{stipend.totalDays} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-medium">
                {stipend.currency} {stipend.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelStipendOverview;
