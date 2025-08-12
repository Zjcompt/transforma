import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import Map from "@/models/map.ts";


interface ExecuteMapProps {
  show: boolean;
  setShow: (show: boolean) => void;
  map: Map;
}

export default function ExecuteMap({ show, setShow, map }: ExecuteMapProps) {
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setInput("")
    setError("")
    setOutput("")
    setLoading(false)
    setShow(false)
  }

  useEffect(() => {
    if (!show) {
      handleClose()
    }
  }, [show])

  const executeMap = async (input: string) => {
    setLoading(true)
    try{
      JSON.parse(input)
      setError("")
    } catch (e) {
      setError("Invalid JSON")
      setLoading(false)
      return
    }

    const response = await fetch(`http://localhost:3000/api/v1/map/${map.id}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: input,
    })

    if (!response.ok) {
      const data = await response.json()
      const errorMessage = data.message ? data.message : JSON.stringify(data.error, null, 2)
      setError(`Failed to execute map: ${errorMessage}`)
      setLoading(false)
      return
    }

    const data = await response.json()
    setOutput(JSON.stringify(data, null, 2));
    setLoading(false);
  }

  return <Dialog open={show} onOpenChange={setShow}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Execute Map</DialogTitle>
        <DialogDescription>
          Execute the map with the given JSON input.
        </DialogDescription>
      </DialogHeader>
      <form className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {loading && <Skeleton className="h-10 w-full" />}
        {!output && !loading && <div className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="input">Input</Label>
            <Textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={10}
                className="font-mono"
                required
              />
          </div>
        </div>}
        {output && !loading && <div className="space-y-2">
          <Label htmlFor="output">Output</Label>
          <Textarea
            id="output"
            value={output}
            rows={10}
            className="font-mono"
            readOnly
          />
        </div>}
      </form>
      <DialogFooter>
        <Button type="submit" onClick={() => executeMap(input)} disabled={loading}>Execute</Button>
        <Button type="button" variant="outline" onClick={handleClose}>
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}