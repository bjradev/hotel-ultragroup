import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageBreadcrumb } from '@/shared/components/common/PageBreadcrumb'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { FullPageLoader } from '@/shared/components/common/LoadingSpinner'
import { ReservationStatusBadge } from '../components/ReservationStatusBadge'
import { ReservationDetailSheet } from '../components/ReservationDetailSheet'
import { useReservationsByHotel } from '../hooks/useReservations'
import { useHotelById } from '@/modules/agency/hotels/hooks/useHotels'
import { useRoomsByHotel } from '@/modules/agency/rooms/hooks/useRooms'
import { formatDate, formatCurrency, formatNights } from '@/shared/lib/formatters'
import type { Reservation } from '@/core/domain/reservation'
import type { Room, RoomType } from '@/core/domain/room'

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  single: 'Individual',
  double: 'Doble',
  suite: 'Suite',
  family: 'Familiar',
  deluxe: 'Deluxe',
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-5 w-22 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-8 w-16 rounded-md" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function ReservationsListPage() {
  const { hotelId = '' } = useParams<{ hotelId: string }>()
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  const { data: hotel, isLoading: isLoadingHotel } = useHotelById(hotelId)
  const { data: reservations = [], isLoading: isLoadingReservations } = useReservationsByHotel(hotelId)
  const { data: rooms = [] } = useRoomsByHotel(hotelId)

  const roomMap = rooms.reduce<Record<string, Room>>((acc, room) => {
    acc[room.id] = room
    return acc
  }, {})

  if (isLoadingHotel) return <FullPageLoader />

  const statusCounts = reservations.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-1">
      <PageBreadcrumb
        crumbs={[
          { label: 'Hoteles', to: '/agency/hotels' },
          { label: hotel?.name ?? 'Hotel', to: '/agency/hotels' },
          { label: 'Reservas' },
        ]}
      />

      <div className="space-y-6">
        <PageHeader
          title="Reservas"
          description={hotel ? `${hotel.name} · ${hotel.city}` : undefined}
        />

        {!isLoadingReservations && reservations.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-semibold mt-0.5">{reservations.length}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground">Confirmadas</p>
              <p className="text-2xl font-semibold mt-0.5 text-emerald-600">
                {statusCounts.confirmed ?? 0}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-semibold mt-0.5 text-amber-500">
                {statusCounts.pending ?? 0}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground">Canceladas</p>
              <p className="text-2xl font-semibold mt-0.5 text-zinc-400">
                {statusCounts.cancelled ?? 0}
              </p>
            </div>
          </div>
        )}

        {!isLoadingReservations && reservations.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No hay reservas registradas"
            description="Las reservas de los viajeros para este hotel apareceran aqui."
          />
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-medium">Huesped</TableHead>
                  <TableHead className="font-medium">Habitacion</TableHead>
                  <TableHead className="font-medium">Check-in</TableHead>
                  <TableHead className="font-medium">Noches</TableHead>
                  <TableHead className="font-medium">Total</TableHead>
                  <TableHead className="font-medium">Estado</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingReservations ? (
                  <TableSkeleton />
                ) : (
                  reservations.map((reservation) => {
                    const room = roomMap[reservation.roomId]
                    const nights = formatNights(reservation.checkIn, reservation.checkOut)
                    return (
                      <TableRow key={reservation.id} className="cursor-pointer hover:bg-muted/30">
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-0.5">
                            <span>{reservation.guest.fullName}</span>
                            <span className="text-xs text-muted-foreground">
                              {reservation.guest.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {room ? ROOM_TYPE_LABELS[room.type] : '—'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(reservation.checkIn)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {nights}
                        </TableCell>
                        <TableCell className="font-medium tabular-nums">
                          {formatCurrency(reservation.totalCost)}
                        </TableCell>
                        <TableCell>
                          <ReservationStatusBadge status={reservation.status} />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedReservation(reservation)}
                          >
                            Ver detalle
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ReservationDetailSheet
        open={Boolean(selectedReservation)}
        onOpenChange={(open) => !open && setSelectedReservation(null)}
        reservation={selectedReservation}
        room={selectedReservation ? roomMap[selectedReservation.roomId] : null}
      />
    </div>
  )
}
