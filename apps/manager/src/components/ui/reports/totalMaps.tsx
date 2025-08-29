import { useEffect, useState } from "react";
import { TextChart } from "@/components/ui/chart.tsx";

export default function TotalMaps() {
  const [data, setData] = useState<string>("0");
  const [realTotal, setRealTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/reports/total-maps")
      .then(response => response.json())
      .then(data => {
        setData(new Intl.NumberFormat('en-US', { notation: 'compact' }).format(data.total));
        setRealTotal(data.total);
      })
      .catch(error => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  return <TextChart data={data} realTotal={realTotal} loading={loading} />
}