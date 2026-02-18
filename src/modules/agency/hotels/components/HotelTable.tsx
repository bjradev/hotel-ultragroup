import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, BedDouble, BookOpen, MoreHorizontal, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Button } from '@/shared/components/ui/button'
import { Switch } from '@/shared/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { HotelStatusBadge } from './HotelStatusBadge'
import type { Hotel } from '@/core/domain/hotel'

type HotelTableProps = {
  hotels: Hotel[]
  isLoading: boolean
  onEdit: (hotel: Hotel) => void
  onToggleStatus: (hotel: Hotel) => void
  isTogglingId?: string | null
}

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="text-amber-400 tracking-tighter text-sm" aria-label={`${stars} estrellas`}>
      {'★'.repeat(stars)}
      <span className="text-muted-foreground/30">{'★'.repeat(5 - stars)}</span>
    </span>
  )
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-36" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function HotelTable({
  hotels,
  isLoading,
  onEdit,
  onToggleStatus,
  isTogglingId,
}: HotelTableProps) {
  const navigate = useNavigate()
  const [confirmToggle, setConfirmToggle] = useState<Hotel | null>(null)

  function handleToggleRequest(hotel: Hotel) {
    if (hotel.isEnabled) {
      setConfirmToggle(hotel)
    } else {
      onToggleStatus(hotel)
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="font-medium">Hotel</TableHead>
              <TableHead className="font-medium">Ciudad</TableHead>
              <TableHead className="hidden md:table-cell font-medium">Dirección</TableHead>
              <TableHead className="font-medium">Categoría</TableHead>
              <TableHead className="font-medium">Estado</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              hotels.map((hotel) => (
                <TableRow
                  key={hotel.id}
                  className={hotel.isEnabled ? '' : 'opacity-60'}
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-0.5">
                      <span>{hotel.name}</span>
                      {hotel.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1 max-w-48">
                          {hotel.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{hotel.city}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {hotel.address}
                  </TableCell>
                  <TableCell>
                    <StarRating stars={hotel.stars} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={hotel.isEnabled}
                        onCheckedChange={() => handleToggleRequest(hotel)}
                        disabled={isTogglingId === hotel.id}
                        aria-label={hotel.isEnabled ? 'Deshabilitar hotel' : 'Habilitar hotel'}
                      />
                      <HotelStatusBadge isEnabled={hotel.isEnabled} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Más opciones"
                          className="text-muted-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => onEdit(hotel)}>
                          <Pencil className="h-4 w-4" />
                          Editar hotel
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => navigate(`/agency/hotels/${hotel.id}/rooms`)}
                        >
                          <BedDouble className="h-4 w-4" />
                          Gestionar habitaciones
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/agency/hotels/${hotel.id}/reservations`)}
                        >
                          <BookOpen className="h-4 w-4" />
                          Ver reservas
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleToggleRequest(hotel)}
                          disabled={!hotel.isEnabled}
                        >
                          <Trash2 className="h-4 w-4" />
                          Deshabilitar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmación al deshabilitar */}
      <AlertDialog
        open={Boolean(confirmToggle)}
        onOpenChange={(open) => !open && setConfirmToggle(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deshabilitar hotel?</AlertDialogTitle>
            <AlertDialogDescription>
              El hotel <strong>{confirmToggle?.name}</strong> dejará de aparecer para los viajeros.
              Puedes volver a habilitarlo en cualquier momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (confirmToggle) {
                  onToggleStatus(confirmToggle)
                  setConfirmToggle(null)
                }
              }}
            >
              Deshabilitar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
