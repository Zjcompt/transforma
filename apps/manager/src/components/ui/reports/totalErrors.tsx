import { useEffect, useState } from "react";
import { TextChart } from "@/components/ui/chart.tsx";

export default function TotalErrors() {
  const [data, setData] = useState<string>("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/reports/total-errors")
      .then(response => response.json())
      .then(data => setData(new Intl.NumberFormat('en-US').format(data.total)))
      .catch(error => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  return <TextChart data={data} loading={loading} />
}