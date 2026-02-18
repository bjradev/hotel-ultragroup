import { useState } from 'react'
import { Pencil, MoreHorizontal } from 'lucide-react'
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
import { Skeleton } from '@/shared/components/ui/skeleton'
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
import { RoomStatusBadge } from './RoomStatusBadge'
import { formatCurrency } from '@/shared/lib/formatters'
import type { Room, RoomType } from '@/core/domain/room'

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  single: 'Individual',
  double: 'Doble',
  suite: 'Suite',
  family: 'Familiar',
  deluxe: 'Deluxe',
}

type RoomTableProps = {
  rooms: Room[]
  isLoading: boolean
  onEdit: (room: Room) => void
  onToggleStatus: (room: Room) => void
  isTogglingId?: string | null
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-4 w-8" /></TableCell>
          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function RoomTable({ rooms, isLoading, onEdit, onToggleStatus, isTogglingId }: RoomTableProps) {
  const [confirmToggle, setConfirmToggle] = useState<Room | null>(null)

  function handleToggleRequest(room: Room) {
    if (room.isEnabled) {
      setConfirmToggle(room)
    } else {
      onToggleStatus(room)
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="font-medium">Tipo</TableHead>
              <TableHead className="font-medium">Costo base</TableHead>
              <TableHead className="font-medium">Impuestos</TableHead>
              <TableHead className="font-medium">Total/noche</TableHead>
              <TableHead className="font-medium">Ubicacion</TableHead>
              <TableHead className="font-medium">Cap.</TableHead>
              <TableHead className="font-medium">Estado</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              rooms.map((room) => (
                <TableRow key={room.id} className={room.isEnabled ? '' : 'opacity-60'}>
                  <TableCell className="font-medium">
                    {ROOM_TYPE_LABELS[room.type]}
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {formatCurrency(room.baseCost)}
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {formatCurrency(room.taxes)}
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {formatCurrency(room.baseCost + room.taxes)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {room.location}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-muted-foreground">{room.capacity}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={room.isEnabled}
                        onCheckedChange={() => handleToggleRequest(room)}
                        disabled={isTogglingId === room.id}
                        aria-label={room.isEnabled ? 'Deshabilitar habitacion' : 'Habilitar habitacion'}
                      />
                      <RoomStatusBadge isEnabled={room.isEnabled} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Mas opciones"
                          className="text-muted-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(room)}>
                          <Pencil className="h-4 w-4" />
                          Editar habitacion
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleToggleRequest(room)}
                          disabled={!room.isEnabled}
                        >
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

      <AlertDialog
        open={Boolean(confirmToggle)}
        onOpenChange={(open) => !open && setConfirmToggle(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deshabilitar habitacion</AlertDialogTitle>
            <AlertDialogDescription>
              La habitacion <strong>{confirmToggle ? ROOM_TYPE_LABELS[confirmToggle.type] : ''}</strong> en{' '}
              <strong>{confirmToggle?.location}</strong> dejara de estar disponible para reservas.
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
