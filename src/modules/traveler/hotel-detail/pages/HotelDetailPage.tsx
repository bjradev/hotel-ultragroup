import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, BedDouble, Calendar, Info } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Separator } from '@/shared/components/ui/separator'
import { RoomCard } from '../components/RoomCard'
import { useTravelerHotelById, useAvailableRooms } from '../../search/hooks/useHotelSearch'
import { useBookingStore } from '@/store/bookingStore'
import { formatDate } from '@/shared/lib/formatters'

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="text-amber-400 text-lg tracking-tight" aria-label={`${stars} estrellas`}>
      {'★'.repeat(stars)}
      <span className="text-muted-foreground/25">{'★'.repeat(5 - stars)}</span>
    </span>
  )
}

function RoomCardSkeleton() {
  return (
    <div className="bg-card border rounded-xl p-5 space-y-4">
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-px w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  )
}

export default function HotelDetailPage() {
  const { hotelId = '' } = useParams<{ hotelId: string }>()
  const navigate = useNavigate()
  const { checkIn, checkOut } = useBookingStore()

  const { data: hotel, isLoading: isLoadingHotel } = useTravelerHotelById(hotelId)
  const { data: rooms = [], isLoading: isLoadingRooms } = useAvailableRooms(
    hotelId,
    checkIn,
    checkOut,
  )

  const hasCheckIn = Boolean(checkIn)
  const hasBothDates = hasCheckIn && Boolean(checkOut)

  return (
    <div className="space-y-8">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground -ml-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a resultados
      </Button>

      {/* Hotel header */}
      {isLoadingHotel ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : hotel ? (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">{hotel.name}</h1>
            <StarRating stars={hotel.stars} />
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            {hotel.address}, {hotel.city}
          </div>

          {hotel.description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {hotel.description}
            </p>
          )}
        </div>
      ) : null}

      <Separator />

      {/* Availability banner */}
      {hasBothDates && checkIn && checkOut ? (
        <div className="flex items-center gap-2.5 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-sm">
          <Calendar className="h-4 w-4 text-primary shrink-0" />
          <span>
            Habitaciones disponibles del{' '}
            <strong>{formatDate(checkIn)}</strong> al{' '}
            <strong>{formatDate(checkOut)}</strong>
          </span>
        </div>
      ) : hasCheckIn && checkIn ? (
        <div className="flex items-center gap-2.5 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-sm">
          <Calendar className="h-4 w-4 text-primary shrink-0" />
          <span>
            Entrada: <strong>{formatDate(checkIn)}</strong> · 1 noche (mínimo).
            Puedes agregar fecha de salida desde la búsqueda.
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 rounded-lg bg-muted/60 border px-4 py-3 text-sm text-muted-foreground">
          <Info className="h-4 w-4 shrink-0" />
          <span>
            No se seleccionaron fechas. Mostrando todas las habitaciones habilitadas.{' '}
            <button
              onClick={() => navigate('/traveler/search')}
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Volver para agregar fechas
            </button>
          </span>
        </div>
      )}

      {/* Rooms */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <BedDouble className="h-5 w-5 text-muted-foreground" />
          Habitaciones disponibles
          {!isLoadingRooms && (
            <span className="text-sm font-normal text-muted-foreground">({rooms.length})</span>
          )}
        </h2>

        {isLoadingRooms ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <RoomCardSkeleton key={`room-skeleton-${i}`} />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <BedDouble className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Sin habitaciones disponibles</p>
              <p className="text-xs text-muted-foreground">
                No hay habitaciones libres para las fechas seleccionadas.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                hotelId={hotelId}
                checkIn={checkIn}
                checkOut={checkOut}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
