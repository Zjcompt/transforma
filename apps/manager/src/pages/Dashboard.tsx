import ErrorsSuccessesDonut from "@/components/ui/reports/errorsSuccessesDonut.tsx";
import ReportContainer from "@/components/ui/reports/report.tsx";
import TotalErrors from "@/components/ui/reports/totalErrors.tsx";
import TotalMaps from "@/components/ui/reports/totalMaps.tsx";
import TotalRuns from "@/components/ui/reports/totalRuns.tsx";
import TopMaps from "@/components/ui/reports/topMaps.tsx";
import MostErrors from "@/components/ui/reports/mostErrors.tsx";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to Transforma Manager.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        <ReportContainer title="Total Maps">
          <TotalMaps />
        </ReportContainer>
        <ReportContainer title="Total Runs">
          <TotalRuns />
        </ReportContainer>
        <ReportContainer title="Total Errors">
          <TotalErrors />
        </ReportContainer>
        <ReportContainer title="Errors and Successes">
          <ErrorsSuccessesDonut />
        </ReportContainer>
        <ReportContainer title="Top Maps">
          <TopMaps />
        </ReportContainer>
        <ReportContainer title="Most Errors">
          <MostErrors />
        </ReportContainer>
      </div>
    </div>
  )
}

