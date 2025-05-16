interface TravelDatesProps {
  startDate: string;
  endDate: string;
}

const TravelDates = ({ startDate, endDate }: TravelDatesProps) => {
  const formatDate = (dateString: string) => {
    // Create date in UTC to avoid timezone issues
    const date = new Date(dateString + "T00:00:00Z");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC", // Ensure consistent date display
    });
  };

  return (
    <div className="bg-card text-card-foreground shadow-md p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">Travel Dates</h3>
      <div className="space-y-2">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Start Date:</span>{" "}
          {formatDate(startDate)}
        </p>
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">End Date:</span>{" "}
          {formatDate(endDate)}
        </p>
      </div>
    </div>
  );
};

export default TravelDates;
