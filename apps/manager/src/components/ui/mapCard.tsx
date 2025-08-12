import Map from "@/models/map.ts";
import { Button } from "@/components/ui/button.tsx";
import { Pencil, Play, Trash2 } from "lucide-react";
import EditMap from "./editMap.tsx";
import { useState } from "react";
import { FormState } from "./editMap.tsx";
import ExecuteMap from "./executeMap.tsx";

/**
 * Props for the MapCard component
 * @param map - The map to display
 * @param openEdit - Function to open the edit modal
 * @param onDelete - Function to delete the map.
 *   Call with only the id to indicate deletion is starting/loading.
 *   Call with (id, true) when deletion succeeds.
 *   Call with (id, false, error) when deletion fails, passing an error message.
 * @param onUpdate - Function to update the map.
 *   Call with (map) when update is starting/loading.
 *   Call with (map, true) when update succeeds.
 *   Call with (map, false, error) when update fails, passing an error message.
 */
interface MapCardProps {
  map: Map;
  onDelete: (id: string, success?: boolean, error?: string) => void;
  onUpdate: (map: Map, success?: boolean, error?: string) => void;
}

export default function MapCard({ map, onDelete, onUpdate }: MapCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [showExecuteMap, setShowExecuteMap] = useState(false);  
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

  const submitForm = async (e: React.FormEvent<HTMLFormElement>, form: FormState) => {
    e.preventDefault();
    onUpdate(map)
    try {
      setShowForm(false)
      const updatedMap = await map.update(form)
      onUpdate(updatedMap, true)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update map'
      onUpdate(map, false, message)
    }
  }

  return (<>
    <ExecuteMap show={showExecuteMap} setShow={setShowExecuteMap} map={map} />
    <div key={map.id} className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{map.name}</h3>
          <div className="text-xs text-muted-foreground">{map.id}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowExecuteMap(true)}>
            <Play className="size-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
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

    {showForm && <EditMap map={map} setShowForm={setShowForm} submitForm={submitForm} />}
  </>
  )
}