import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx"
import { Skeleton } from "../skeleton.tsx";

export default function TopMaps() {
  const [data, setData] = useState<{ name: string; total: number, fill: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/reports/most-errors")
      .then(response => response.json())
      .then(data => {
        const topMaps = data.mostErrors.slice(0, 5);
        setData(
          topMaps.map(
            (map: { name: string, total: string }, index: number) => 
              ({
                name: map.name,
                total: parseInt(map.total),
                fill: `var(--color-chart-${index + 1})`
              })
            )
          );
      })
      .catch(error => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);


  if (loading) {
    return <Skeleton className="mx-auto h-full aspect-video" />;
  }

  return <ChartContainer config={{}} className="mx-auto w-full h-full">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Bar dataKey="total" />
      <ChartTooltip content={<ChartTooltipContent />} />
      <ChartLegend content={<ChartLegendContent />} />
    </BarChart>
  </ChartContainer>
}