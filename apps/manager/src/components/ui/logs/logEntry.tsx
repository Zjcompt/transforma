import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Calendar, AlertCircle, CheckCircle, Map, Code } from 'lucide-react'
import Run, { ErroredRun } from '@/models/run.ts'

interface LogEntryProps {
  entry: Run | ErroredRun;
  type: 'success' | 'error';
}

export default function LogEntry({ entry, type }: LogEntryProps) {
  const isErrored = type === 'error' && 'error' in entry;
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const formatJson = (obj: object | string) => {
    let json = obj;
    if (typeof obj === 'string') {
      try {
        json = JSON.parse(obj);
      } catch {
        return String(obj);
      }
    }
    try {
      return JSON.stringify(json, null, 2);
    } catch {
      return String(json);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isErrored ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <CardTitle className="text-sm font-medium">
              {isErrored ? 'Failed Execution' : 'Successful Execution'}
            </CardTitle>
            <Badge variant={isErrored ? 'destructive' : 'default'}>
              {isErrored ? 'Error' : 'Success'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Map className="h-3 w-3" />
              <span>{entry.mapName || 'Unknown Map'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(entry.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Code className="h-3 w-3" />
              Input
            </div>
            <div className="bg-muted/50 rounded-md p-3 text-xs font-mono overflow-auto max-h-64">
              <pre>{formatJson(entry.input)}</pre>
            </div>
          </div>

          {/* Output or Error */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Code className="h-3 w-3" />
              {isErrored ? 'Error' : 'Output'}
            </div>
            <div className={`rounded-md p-3 text-xs font-mono overflow-auto max-h-64 ${
              isErrored ? 'bg-destructive/10 text-destructive' : 'bg-muted/50'
            }`}>
              <pre>
                {isErrored 
                  ? formatJson((entry as ErroredRun).error)
                  : formatJson((entry as Run).output)
                }
              </pre>
            </div>
          </div>
        </div>

        {/* ID and Map ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t text-xs text-muted-foreground">
          <div>
            <span className="font-medium">Execution ID:</span> {entry.id}
          </div>
          <div>
            <span className="font-medium">Map ID:</span> {entry.mapId}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}