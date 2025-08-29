import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Search, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import Run, { ErroredRun } from '@/models/run.ts'
import { Pagination as PaginationType } from '@transforma/imports/interfaces/pagination.ts'
import LogEntry from '@/components/ui/logs/logEntry.tsx'
import Pagination from '@/components/ui/logs/pagination.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

type LogType = 'success' | 'error';

export default function Logs() {
  const [logType, setLogType] = useState<LogType>('success')
  const [runs, setRuns] = useState<Run[]>([])
  const [erroredRuns, setErroredRuns] = useState<ErroredRun[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationType | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const fetchRuns = useCallback(
    async (pageParam: number, limitParam: number, searchParam?: string) => {
      try {
        setLoading(true)
        setError(null)
        const result = await Run.getRuns(pageParam, limitParam, searchParam)
        setRuns(result.runs)
        setPagination(result.pagination)
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error fetching runs'
        setError(message)
      } finally {
        setLoading(false)
      }
    }, [])

  const fetchErroredRuns = useCallback(
    async (pageParam: number, limitParam: number, searchParam?: string) => {
      try {
        setLoading(true)
        setError(null)
        const result = await ErroredRun.getErroredRuns(pageParam, limitParam, searchParam)
        setErroredRuns(result.erroredRuns)
        setPagination(result.pagination)
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error fetching errored runs'
        setError(message)
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    if (search.trim()) {
      setLoading(true)
      setError(null)
      setPagination(null)
      setRuns([])
      setErroredRuns([])
    }
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 1000)
    return () => clearTimeout(id)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [logType, debouncedSearch])

  useEffect(() => {
    setPagination(null)
    if (logType === 'success') {
      fetchRuns(page, limit, debouncedSearch || undefined)
    } else {
      fetchErroredRuns(page, limit, debouncedSearch || undefined)
    }
  }, [page, limit, debouncedSearch, logType, fetchRuns, fetchErroredRuns])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleRefresh = () => {
    if (logType === 'success') {
      fetchRuns(page, limit, debouncedSearch || undefined)
    } else {
      fetchErroredRuns(page, limit, debouncedSearch || undefined)
    }
  }

  const currentEntries = logType === 'success' ? runs : erroredRuns

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Logs</h1>
          <p className="text-muted-foreground">View execution logs and errors</p>
        </div>
        <Button onClick={handleRefresh} disabled={loading} size="sm" variant="outline">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Type Toggle */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setLogType('success')}
            variant={logType === 'success' ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Successful Runs
          </Button>
          <Button
            onClick={() => setLogType('error')}
            variant={logType === 'error' ? 'destructive' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            Errored Runs
          </Button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={logType === 'success' ? 'Search runs...' : 'Search errors...'}
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3 text-sm">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {loading && currentEntries.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ))
        ) : currentEntries.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              {logType === 'success' ? (
                <CheckCircle className="h-12 w-12 text-muted-foreground" />
              ) : (
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-2">
              No {logType === 'success' ? 'successful runs' : 'errors'} found
            </h3>
            <p className="text-muted-foreground">
              {search
                ? 'Try adjusting your search terms'
                : `No ${logType === 'success' ? 'successful executions' : 'errors'} to display yet`}
            </p>
          </div>
        ) : (
          currentEntries.map((entry) => (
            <LogEntry key={entry.id} entry={entry} type={logType} />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  )
}

