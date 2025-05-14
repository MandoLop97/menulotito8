
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  type?: "money" | "number";
}

const StatsCard = ({ title, value, type = "money" }: StatsCardProps) => {
  const formattedValue = type === "money" 
    ? (typeof value === "number" ? `$${value}` : value) 
    : value;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
