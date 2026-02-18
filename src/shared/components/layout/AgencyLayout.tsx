import { Outlet, NavLink, Link, useMatch } from 'react-router-dom'
import { Hotel, BedDouble, BookOpen, Compass } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export default function AgencyLayout() {
  // Detecta si estamos dentro del contexto de un hotel específico
  const hotelMatch = useMatch('/agency/hotels/:hotelId/*')
  const hotelId = hotelMatch?.params.hotelId

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-60 border-r bg-card flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-14 border-b">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Hotel className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Panel Agencia</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            General
          </p>

          <NavLink
            to="/agency/hotels"
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            <Hotel className="h-4 w-4 shrink-0" />
            Hoteles
          </NavLink>

          {/* Sub-nav contextual — solo activo si hay hotelId en la URL */}
          <div className="mt-3">
            <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Hotel actual
            </p>
            <div className="flex flex-col gap-0.5">
              {hotelId ? (
                <>
                  <NavLink
                    to={`/agency/hotels/${hotelId}/rooms`}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      )
                    }
                  >
                    <BedDouble className="h-4 w-4 shrink-0" />
                    Habitaciones
                  </NavLink>
                  <NavLink
                    to={`/agency/hotels/${hotelId}/reservations`}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      )
                    }
                  >
                    <BookOpen className="h-4 w-4 shrink-0" />
                    Reservas
                  </NavLink>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground/40 select-none">
                    <BedDouble className="h-4 w-4 shrink-0" />
                    Habitaciones
                  </div>
                  <div className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground/40 select-none">
                    <BookOpen className="h-4 w-4 shrink-0" />
                    Reservas
                  </div>
                  <p className="px-3 pt-1 text-xs text-muted-foreground/50 italic">
                    Selecciona un hotel primero
                  </p>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Footer nav */}
        <div className="p-3 border-t">
          <Link
            to="/traveler/search"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Compass className="h-4 w-4 shrink-0" />
            Portal viajero
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="h-14 border-b flex items-center px-6 bg-card">
          <span className="text-sm text-muted-foreground">UltraGroup Travel - Administración</span>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
