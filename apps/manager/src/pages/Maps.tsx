import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import Map from '@/models/map.ts'
import { Pagination } from '@transforma/imports/interfaces/pagination.ts'
import MapCard from '@/components/ui/mapCard.tsx'
import EditMap from '@/components/ui/editMap.tsx'
import { FormState } from '@/components/ui/editMap.tsx'
import MapCardSkeleton from '@/components/ui/mapCardSkeleton.tsx'
import { Input } from '@/components/ui/input.tsx'

export default function Maps() {
  const [maps, setMaps] = useState<Map[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(9)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const fetchMaps = useCallback(
    async (pageParam: number, limitParam: number, searchParam?: string) => {
      try {
        setLoading(true)
        setError(null)
        const maps = await Map.getMaps(pageParam, limitParam, searchParam)
        setMaps(maps.maps)
        setPagination(maps.pagination)
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error fetching maps'
        setError(message)
      } finally {
        setLoading(false)
      }
    }, [])

  // Debounce search input to avoid excessive requests
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(id)
  }, [search])

  useEffect(() => {
    fetchMaps(page, limit, debouncedSearch || undefined)
  }, [page, limit, debouncedSearch, fetchMaps])

  const submitForm = async (e: React.FormEvent<HTMLFormElement>, form: FormState) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      const map = await Map.create(form)
      setMaps((prev) => [...prev, map])
      setShowForm(false)
      fetchMaps(page, limit)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to save map'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id: string, success?: boolean, error?: string) => {
    if (success) {
      setMaps((prev) => prev.filter((x) => x.id !== id));
      await fetchMaps(page, limit);
    } else if (error) {
      setError(error);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }

  const onUpdate = async (map: Map, success?: boolean, error?: string) => {
    if (success) {
      setMaps((prev) => prev.map((x) => x.id === map.id ? map : x))
      setLoading(false);
    } else if (error) {
      setError(error)
      setLoading(false);
    } else {
      setLoading(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Maps</h1>
          <p className="text-muted-foreground">Manage your maps here.</p>
        </div>
        <div className="flex items-center gap-2 w-1/2">
          <Input
            placeholder="Search maps..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
          {search && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('')
                setPage(1)
              }}
            >
              Clear
            </Button>
          )}
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="size-4" /> Add Map
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: limit }).map((_, i) => (
            <MapCardSkeleton key={i} />
          ))
          : maps.length > 0
            ? maps.map((map) => (
              <MapCard key={map.id} map={map} onDelete={onDelete} onUpdate={onUpdate} />
            ))
            : (
              <div className="col-span-full text-center text-sm text-muted-foreground py-8">
                No maps found{debouncedSearch ? ` for "${debouncedSearch}"` : ''}.
              </div>
            )}
      </div>

      {pagination && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrev || loading}
            >
              <ChevronLeft className="size-4" /> Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => (pagination.hasNext ? p + 1 : p))}
              disabled={!pagination.hasNext || loading}
            >
              Next <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {showForm && <EditMap setShowForm={setShowForm} submitForm={submitForm} />}
    </div>
  )
}

