import './App.css'
import { Button } from '@/components/ui/button.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'

function App() {
  return (
    <ThemeProvider>
      <div className="bg-background">
        <h1>Hello World</h1>
        <Button>Click me</Button>
      </div>
    </ThemeProvider>
  )
}

export default App;