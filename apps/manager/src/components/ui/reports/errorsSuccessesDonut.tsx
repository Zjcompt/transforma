import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart.tsx"
import { useEffect, useState } from "react";
import { Skeleton } from "../skeleton.tsx";

export default function ErrorsSuccessesDonut() {
  const [data, setData] = useState<{ name: string; value: number; fill: string }[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch("http://localhost:3000/api/v1/reports/total-errors")
      .then(response => response.json())
      .then(async errorsData => {
        try {
          const successesResponse = await fetch("http://localhost:3000/api/v1/reports/total-successes");
          const successesData = await successesResponse.json();
          setData([
            { name: "Errors", value: errorsData.total, fill: "var(--chart-1)" },
            { name: "Successes", value: successesData.total, fill: "var(--chart-2)" }
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      })
      .catch(error => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  const chartConfig: ChartConfig = {
    Errors: {
      label: "Errors",
      color: "var(--color-chart-1)",
    },
    Successes: {
      label: "Successes",
      color: "var(--color-chart-2)",
    },
  };

  if (loading) {
    return <Skeleton className="mx-auto rounded-full h-full aspect-square" />;
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto w-full h-full"
    >
      <PieChart>
        <ChartTooltip 
          cursor={false} 
          content={<ChartTooltipContent hideLabel />} 
        />
        <Pie 
          data={data} 
          dataKey="value" 
          nameKey="name" 
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
        />
      </PieChart>
    </ChartContainer>
  )
}