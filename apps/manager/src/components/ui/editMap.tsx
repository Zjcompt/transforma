import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useState } from "react";
import Map from "@/models/map.ts";

export type FormState = {
  id?: string
  name: string
  type: 'jsonSchema' | 'json'
  inputSchema: string
  outputSchema: string
}

interface EditMapProps {
  map?: Map;
  setShowForm: (show: boolean) => void;
  submitForm: (e: React.FormEvent<HTMLFormElement>, form: FormState) => void;
}

export default function EditMap({ map, setShowForm, submitForm }: EditMapProps) {

  const [form, setForm] = useState<FormState>({
    id: map?.id,
    name: map?.name || '',
    type: map?.type || 'jsonSchema',
    inputSchema: map?.inputSchema || '{\n}\n',
    outputSchema: map?.outputSchema || '{\n}\n',
  })

  return (
    <Dialog open onOpenChange={setShowForm}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{map ? "Edit Map" : "Add Map"}</DialogTitle>
          <DialogDescription>
            Schemas should be valid JSON strings. When you create a map, its JavaScript will be generated on the server.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => submitForm(e, form)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={form.type}
                onValueChange={(value: string) =>
                  setForm((f) => ({ ...f, type: value as FormState["type"] }))
                }
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jsonSchema">jsonSchema</SelectItem>
                  <SelectItem value="json">json</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inputSchema">Input Schema</Label>
              <Textarea
                id="inputSchema"
                rows={8}
                className="font-mono"
                value={form.inputSchema}
                onChange={(e) => setForm((f) => ({ ...f, inputSchema: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outputSchema">Output Schema</Label>
              <Textarea
                id="outputSchema"
                rows={8}
                className="font-mono"
                value={form.outputSchema}
                onChange={(e) => setForm((f) => ({ ...f, outputSchema: e.target.value }))}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit">{map ? "Save" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}