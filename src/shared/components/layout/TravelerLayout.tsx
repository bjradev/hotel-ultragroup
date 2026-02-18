import { Outlet, NavLink } from 'react-router-dom'
import { Hotel, Search } from 'lucide-react'

export default function TravelerLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Hotel className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">UltraGroup Travel</span>
        </div>
        <nav className="flex items-center gap-4">
          <NavLink
            to="/traveler/search"
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Search className="h-4 w-4" />
            Buscar hoteles
          </NavLink>
          <NavLink
            to="/agency/hotels"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Panel agencia
          </NavLink>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <Outlet />
      </main>

      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} UltraGroup Travel
      </footer>
    </div>
  )
}
