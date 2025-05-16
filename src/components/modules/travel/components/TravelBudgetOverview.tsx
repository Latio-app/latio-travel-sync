import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface Budget {
  initial: number;
  spent: number;
  currency: string;
}

interface TravelBudgetOverviewProps {
  budget?: Budget;
  isLoading?: boolean;
}

const TravelBudgetOverview = ({
  budget,
  isLoading,
}: TravelBudgetOverviewProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (
    !budget ||
    typeof budget.initial !== "number" ||
    typeof budget.spent !== "number"
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No budget information available.
          </p>
        </CardContent>
      </Card>
    );
  }

  const remaining = budget.initial - budget.spent;
  const spentPercentage = (budget.spent / budget.initial) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Initial Budget</span>
              <span className="font-medium">
                {budget.currency || "USD"} {budget.initial.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Spent</span>
              <span className="font-medium">
                {budget.currency || "USD"} {budget.spent.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-medium">
                {budget.currency || "USD"} {remaining.toLocaleString()}
              </span>
            </div>
          </div>
          <Progress value={spentPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {spentPercentage.toFixed(1)}% of budget spent
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelBudgetOverview;
