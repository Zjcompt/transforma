import { useMemo } from "react"
import { NavLink } from "react-router-dom"

type NavItem = {
  label: string
  href: string
}

export function Sidebar() {
  const items: NavItem[] = useMemo(
    () => [
      { label: "Dashboard", href: "/" },
      { label: "Maps", href: "/maps" },
      { label: "Logs", href: "/logs" },
    ],
    []
  )

  return (
    <aside className="w-56 border-r bg-sidebar/50 h-full">
      <nav className="p-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }: { isActive: boolean }) =>
              `block px-3 py-2 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
              }`
            }
            end={item.href === "/"}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar

