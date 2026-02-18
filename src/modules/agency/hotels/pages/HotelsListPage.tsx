import { useState } from 'react'
import { Plus, Hotel } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { HotelTable } from '../components/HotelTable'
import { HotelForm } from '../components/HotelForm'
import {
  useHotels,
  useCreateHotel,
  useUpdateHotel,
  useToggleHotelStatus,
} from '../hooks/useHotels'
import type { Hotel as HotelEntity } from '@/core/domain/hotel'

type HotelFormValues = {
  name: string
  description: string
  city: string
  address: string
  stars: number
  isEnabled: boolean
}

export default function HotelsListPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<HotelEntity | null>(null)

  const { data: hotels = [], isLoading } = useHotels()
  const createHotel = useCreateHotel()
  const updateHotel = useUpdateHotel()
  const toggleStatus = useToggleHotelStatus()

  const isTogglingId = toggleStatus.isPending ? (toggleStatus.variables as { id: string } | undefined)?.id : null

  function handleNewHotel() {
    setSelectedHotel(null)
    setSheetOpen(true)
  }

  function handleEditHotel(hotel: HotelEntity) {
    setSelectedHotel(hotel)
    setSheetOpen(true)
  }

  async function handleSubmit(values: HotelFormValues) {
    if (selectedHotel) {
      await updateHotel.mutateAsync({ id: selectedHotel.id, payload: values })
    } else {
      await createHotel.mutateAsync(values)
    }
    setSheetOpen(false)
    setSelectedHotel(null)
  }

  function handleToggleStatus(hotel: HotelEntity) {
    toggleStatus.mutate({ id: hotel.id, isEnabled: !hotel.isEnabled })
  }

  const enabledCount = hotels.filter((h) => h.isEnabled).length
  const disabledCount = hotels.length - enabledCount

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hoteles"
        description="Gestiona el catálogo de hoteles de la agencia"
        action={
          <Button onClick={handleNewHotel} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo hotel
          </Button>
        }
      />

      {/* Stats rápidas */}
      {!isLoading && hotels.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-semibold mt-0.5">{hotels.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">Habilitados</p>
            <p className="text-2xl font-semibold mt-0.5 text-emerald-600">{enabledCount}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">Deshabilitados</p>
            <p className="text-2xl font-semibold mt-0.5 text-zinc-400">{disabledCount}</p>
          </div>
        </div>
      )}

      {/* Tabla o estado vacío */}
      {!isLoading && hotels.length === 0 ? (
        <EmptyState
          icon={Hotel}
          title="No hay hoteles registrados"
          description="Crea el primer hotel para comenzar a gestionar habitaciones y reservas."
          action={
            <Button onClick={handleNewHotel} variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Crear primer hotel
            </Button>
          }
        />
      ) : (
        <HotelTable
          hotels={hotels}
          isLoading={isLoading}
          onEdit={handleEditHotel}
          onToggleStatus={handleToggleStatus}
          isTogglingId={isTogglingId}
        />
      )}

      <HotelForm
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open)
          if (!open) setSelectedHotel(null)
        }}
        hotel={selectedHotel}
        onSubmit={handleSubmit}
        isPending={createHotel.isPending || updateHotel.isPending}
      />
    </div>
  )
}
