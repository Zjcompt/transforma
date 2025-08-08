import Map from "@/models/map.ts";
import { Button } from "@/components/ui/button.tsx";
import { Pencil, Trash2 } from "lucide-react";

/**
 * Props for the MapCard component
 * @param map - The map to display
 * @param openEdit - Function to open the edit modal
 * @param onDelete - Function to delete the map.
 *   Call with only the id to indicate deletion is starting/loading.
 *   Call with (id, true) when deletion succeeds.
 *   Call with (id, false, error) when deletion fails, passing an error message.
 */
interface MapCardProps {
  map: Map;
  openEdit: (m: Map) => void;
  onDelete: (id: string, success?: boolean, error?: string) => void;
}

export default function MapCard({ map, openEdit, onDelete }: MapCardProps) {

  const deleteMap = async () => {
    if (!confirm('Delete this map? This cannot be undone.')) return;
    onDelete(map.id)
    try {
      await map.delete()
      onDelete(map.id, true)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to delete map'
      onDelete(map.id, false, message)
    }
  }

  return (
    <div key={map.id} className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{map.name}</h3>
          <div className="text-xs text-muted-foreground">{map.id}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(map)}>
            <Pencil className="size-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => deleteMap()}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      <div className="mt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type</span>
          <span className="font-medium">{map.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Times Ran</span>
          <span className="font-medium">{Number(map.timesRan || 0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Last Run</span>
          <span className="font-medium">{map.lastRun ? new Date(map.lastRun).toLocaleString() : '—'}</span>
        </div>
      </div>
    </div>
  )
}