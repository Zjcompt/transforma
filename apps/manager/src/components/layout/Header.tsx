import logoUrl from "@/assets/transformarounded.png"
import { Link } from "react-router-dom"

export function Header() {
  return (
    <header className="h-14 border-b flex items-center justify-between px-4 bg-background">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoUrl} alt="Logo" className="h-8 w-8" />
        </Link>
      </div>
    </header>
  )
}

export default Header

