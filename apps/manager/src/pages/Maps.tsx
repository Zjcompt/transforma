import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import Map from '@/models/map.ts'
import { Pagination } from '@transforma/imports/interfaces/pagination.ts'

type FormState = {
  id?: string
  name: string
  type: 'jsonSchema' | 'json'
  inputSchema: string
  outputSchema: string
}

export default function Maps() {
  const [maps, setMaps] = useState<Map[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const initialForm = useMemo<FormState>(
    () => ({ name: '', type: 'jsonSchema', inputSchema: '{\n}\n', outputSchema: '{\n}\n' }),
    []
  )
  const [form, setForm] = useState<FormState>(initialForm)

  const fetchMaps = useCallback(
    async (pageParam: number, limitParam: number) => {
      try {
        setLoading(true)
        setError(null)
        const maps = await Map.getMaps(pageParam, limitParam)
      setMaps(maps.maps)
      setPagination(maps.pagination)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error fetching maps'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])


  useEffect(() => {
    fetchMaps(page, limit)
  }, [page, limit, fetchMaps])

  const openAdd = () => {
    setIsEditing(false)
    setForm(initialForm)
    setShowForm(true)
  }

  const openEdit = (m: Map) => {
    setIsEditing(true)
    setForm({ id: m.id, name: m.name, type: m.type, inputSchema: m.inputSchema, outputSchema: m.outputSchema })
    setShowForm(true)
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      if (isEditing && form.id) {
        const { id, ...update } = form
        const map = maps.find((x) => x.id === id)
        if (!map) throw new Error('Map not found')
        await map.update(update)
      } else {
        const map = await Map.create(form)
        setMaps((prev) => [...prev, map])
      }
      setShowForm(false)
      setForm(initialForm)
      fetchMaps(page, limit)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to save map'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Delete this map? This cannot be undone.')) return
    try {
      setLoading(true)
      setError(null)
      const map = maps.find((x) => x.id === id)
      if (!map) throw new Error('Map not found')
      await map.delete()
      setMaps((prev) => prev.filter((x) => x.id !== id))
      fetchMaps(page, limit)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to delete map'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Maps</h1>
          <p className="text-muted-foreground">Manage your maps here.</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="size-4" /> Add Map
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {maps.map((m) => (
          <div key={m.id} className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{m.name}</h3>
                <div className="text-xs text-muted-foreground">{m.id}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(m)}>
                  <Pencil className="size-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(m.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{m.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Times Ran</span>
                <span className="font-medium">{Number(m.timesRan || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Run</span>
                <span className="font-medium">{m.lastRun ? new Date(m.lastRun).toLocaleString() : '—'}</span>
              </div>
            </div>
          </div>
        ))}
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

      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-popover text-popover-foreground w-full max-w-2xl rounded-lg border shadow-xl">
            <form onSubmit={submitForm} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{isEditing ? 'Edit Map' : 'Add Map'}</h2>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={loading}>Cancel</Button>
                  <Button type="submit" disabled={loading}>{isEditing ? 'Save' : 'Create'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="name">Name</label>
                  <input
                    id="name"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="type">Type</label>
                  <select
                    id="type"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as FormState['type'] }))}
                    required
                  >
                    <option value="jsonSchema">jsonSchema</option>
                    <option value="json">json</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="inputSchema">Input Schema</label>
                  <textarea
                    id="inputSchema"
                    rows={8}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
                    value={form.inputSchema}
                    onChange={(e) => setForm((f) => ({ ...f, inputSchema: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="outputSchema">Output Schema</label>
                  <textarea
                    id="outputSchema"
                    rows={8}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
                    value={form.outputSchema}
                    onChange={(e) => setForm((f) => ({ ...f, outputSchema: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Schemas should be valid JSON strings. When you create a map, its JavaScript will be generated on the server.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

