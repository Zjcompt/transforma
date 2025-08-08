import { ThemeProvider } from '@/components/theme-provider.tsx'
import Header from '@/components/layout/Header.tsx'
import Sidebar from '@/components/layout/Sidebar.tsx'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <ThemeProvider>
      <div className="bg-background text-foreground h-dvh">
        <Header />
        <div className="flex h-[calc(100vh-56px)]">
          <Sidebar />
          <main className="p-6 flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App;