import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

type MapItem = {
  id: string
  name: string
  type: string
  inputSchema: string
  outputSchema: string
  javascript: string
  timesRan: number
  lastRun: string
  updatedAt: string
  createdAt: string
}

type PaginatedMaps = {
  data: MapItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

type FormState = {
  id?: string
  name: string
  type: 'jsonSchema' | 'csv'
  inputSchema: string
  outputSchema: string
}

export default function Maps() {
  const [items, setItems] = useState<MapItem[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginatedMaps['pagination'] | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const initialForm = useMemo<FormState>(
    () => ({ name: '', type: 'jsonSchema', inputSchema: '{\n}\n', outputSchema: '{\n}\n' }),
    []
  )
  const [form, setForm] = useState<FormState>(initialForm)

  const fetchMaps = async (pageParam: number = page) => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`http://localhost:3000/api/v1/map?page=${pageParam}&limit=${limit}`)
      if (!res.ok) throw new Error('Failed to fetch maps')
      const json: PaginatedMaps = await res.json()
      setItems(json.data)
      setPagination(json.pagination)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error fetching maps'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaps(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const openAdd = () => {
    setIsEditing(false)
    setForm(initialForm)
    setShowForm(true)
  }

  const openEdit = (m: MapItem) => {
    setIsEditing(true)
    const mapType: FormState['type'] = m.type === 'csv' || m.type === 'jsonSchema' ? (m.type as FormState['type']) : 'jsonSchema'
    setForm({ id: m.id, name: m.name, type: mapType, inputSchema: m.inputSchema, outputSchema: m.outputSchema })
    setShowForm(true)
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      if (isEditing && form.id) {
        const { id, ...update } = form
        const res = await fetch(`/api/v1/map/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update),
        })
        if (!res.ok) throw new Error('Failed to update map')
      } else {
        const res = await fetch('/api/v1/map', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) {
          let errMsg = 'Failed to create map'
          const contentType = res.headers.get('content-type') || ''
          if (contentType.includes('application/json')) {
            const j = (await res.json()) as { error?: string }
            if (j?.error) errMsg = j.error
          } else {
            const t = await res.text()
            if (t) errMsg = t
          }
          throw new Error(errMsg)
        }
      }
      setShowForm(false)
      setForm(initialForm)
      fetchMaps(page)
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
      const res = await fetch(`/api/v1/map/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete map')
      setItems((prev) => prev.filter((x) => x.id !== id))
      // Optionally refresh pagination if needed
      fetchMaps(page)
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
        {items.map((m) => (
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
                    <option value="csv">csv</option>
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

