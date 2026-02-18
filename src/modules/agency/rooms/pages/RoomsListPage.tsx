import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, BedDouble } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageBreadcrumb } from '@/shared/components/common/PageBreadcrumb'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { FullPageLoader } from '@/shared/components/common/LoadingSpinner'
import { RoomTable } from '../components/RoomTable'
import { RoomForm } from '../components/RoomForm'
import { useRoomsByHotel, useCreateRoom, useUpdateRoom, useToggleRoomStatus } from '../hooks/useRooms'
import { useHotelById } from '@/modules/agency/hotels/hooks/useHotels'
import type { Room } from '@/core/domain/room'
import type { RoomFormValues } from '../components/RoomForm'

export default function RoomsListPage() {
  const { hotelId = '' } = useParams<{ hotelId: string }>()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  const { data: hotel, isLoading: isLoadingHotel } = useHotelById(hotelId)
  const { data: rooms = [], isLoading: isLoadingRooms } = useRoomsByHotel(hotelId)
  const createRoom = useCreateRoom(hotelId)
  const updateRoom = useUpdateRoom(hotelId)
  const toggleStatus = useToggleRoomStatus(hotelId)

  const isTogglingId = toggleStatus.isPending
    ? (toggleStatus.variables as { id: string } | undefined)?.id
    : null

  function handleNewRoom() {
    setSelectedRoom(null)
    setSheetOpen(true)
  }

  function handleEditRoom(room: Room) {
    setSelectedRoom(room)
    setSheetOpen(true)
  }

  async function handleSubmit(values: RoomFormValues) {
    if (selectedRoom) {
      await updateRoom.mutateAsync({ id: selectedRoom.id, payload: values })
    } else {
      await createRoom.mutateAsync(values)
    }
    setSheetOpen(false)
    setSelectedRoom(null)
  }

  function handleToggleStatus(room: Room) {
    toggleStatus.mutate({ id: room.id, isEnabled: !room.isEnabled })
  }

  if (isLoadingHotel) return <FullPageLoader />

  const enabledCount = rooms.filter((r) => r.isEnabled).length

  return (
    <div className="space-y-1">
      <PageBreadcrumb
        crumbs={[
          { label: 'Hoteles', to: '/agency/hotels' },
          { label: hotel?.name ?? 'Hotel', to: `/agency/hotels` },
          { label: 'Habitaciones' },
        ]}
      />

      <div className="space-y-6">
        <PageHeader
          title="Habitaciones"
          description={hotel ? `${hotel.name} · ${hotel.city}` : undefined}
          action={
            <Button onClick={handleNewRoom} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva habitacion
            </Button>
          }
        />

        {!isLoadingRooms && rooms.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-semibold mt-0.5">{rooms.length}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground">Disponibles</p>
              <p className="text-2xl font-semibold mt-0.5 text-emerald-600">{enabledCount}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground">No disponibles</p>
              <p className="text-2xl font-semibold mt-0.5 text-zinc-400">
                {rooms.length - enabledCount}
              </p>
            </div>
          </div>
        )}

        {!isLoadingRooms && rooms.length === 0 ? (
          <EmptyState
            icon={BedDouble}
            title="No hay habitaciones registradas"
            description="Crea la primera habitacion para comenzar a recibir reservas en este hotel."
            action={
              <Button onClick={handleNewRoom} variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Crear primera habitacion
              </Button>
            }
          />
        ) : (
          <RoomTable
            rooms={rooms}
            isLoading={isLoadingRooms}
            onEdit={handleEditRoom}
            onToggleStatus={handleToggleStatus}
            isTogglingId={isTogglingId}
          />
        )}
      </div>

      <RoomForm
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open)
          if (!open) setSelectedRoom(null)
        }}
        room={selectedRoom}
        onSubmit={handleSubmit}
        isPending={createRoom.isPending || updateRoom.isPending}
      />
    </div>
  )
}
