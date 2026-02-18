import { useNavigate } from 'react-router-dom'
import { Users, MapPin, ArrowRight, CalendarPlus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'
import { formatCurrency, formatNights, resolveCheckOut } from '@/shared/lib/formatters'
import type { Room, RoomType } from '@/core/domain/room'

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  single: 'Individual',
  double: 'Doble',
  suite: 'Suite',
  family: 'Familiar',
  deluxe: 'Deluxe',
}

const ROOM_TYPE_COLORS: Record<RoomType, string> = {
  single: 'bg-blue-50 text-blue-700 border-blue-200',
  double: 'bg-violet-50 text-violet-700 border-violet-200',
  suite: 'bg-amber-50 text-amber-700 border-amber-200',
  family: 'bg-green-50 text-green-700 border-green-200',
  deluxe: 'bg-rose-50 text-rose-700 border-rose-200',
}

type RoomCardProps = {
  room: Room
  hotelId: string
  checkIn: Date | null
  checkOut: Date | null
}

export function RoomCard({ room, hotelId, checkIn, checkOut }: RoomCardProps) {
  const navigate = useNavigate()
  const hasCheckIn = Boolean(checkIn)
  const effectiveCheckOut = checkIn ? resolveCheckOut(checkIn, checkOut) : null
  const nights = checkIn && effectiveCheckOut ? formatNights(checkIn, effectiveCheckOut) : null
  const totalCost = (room.baseCost + room.taxes) * (nights ?? 1)
  const isInferred = hasCheckIn && !checkOut

  return (
    <article className="bg-card border rounded-xl p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Badge className={ROOM_TYPE_COLORS[room.type]}>
            {ROOM_TYPE_LABELS[room.type]}
          </Badge>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {room.location}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Precio */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Costo base</span>
          <span>{formatCurrency(room.baseCost)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Impuestos</span>
          <span>{formatCurrency(room.taxes)}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium pt-1 border-t">
          <span>Por noche</span>
          <span>{formatCurrency(room.baseCost + room.taxes)}</span>
        </div>
        {nights !== null && nights > 0 && (
          <div className="flex justify-between items-center text-base font-semibold text-primary">
            <span>
              Total · {nights} {nights === 1 ? 'noche' : 'noches'}
              {isInferred && <span className="text-xs font-normal text-muted-foreground ml-1">(mín.)</span>}
            </span>
            <span>{formatCurrency(totalCost)}</span>
          </div>
        )}
      </div>

      {/* CTA */}
      {hasCheckIn ? (
        <Button
          onClick={() => navigate(`/traveler/hotels/${hotelId}/book/${room.id}`)}
          className="w-full gap-2 mt-auto"
        >
          Reservar
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => navigate('/traveler/search')}
          className="w-full gap-2 mt-auto"
        >
          <CalendarPlus className="h-4 w-4" />
          Agrega fechas para reservar
        </Button>
      )}
    </article>
  )
}
