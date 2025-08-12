import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";


interface ReportContainerProps {
  title: string;
  children: React.ReactNode;
}

export default function Report({ title, children }: ReportContainerProps) {
  return <Card className="p-4 max-h-[300px]">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="h-[calc(100%-46px)]">
      {children}
    </CardContent>
  </Card>
}