import { Calendar, BedDouble, MapPin, Users } from 'lucide-react'
import { Separator } from '@/shared/components/ui/separator'
import { formatCurrency, formatDate, formatNights } from '@/shared/lib/formatters'
import type { Hotel } from '@/core/domain/hotel'
import type { Room, RoomType } from '@/core/domain/room'

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  single: 'Individual',
  double: 'Doble',
  suite: 'Suite',
  family: 'Familiar',
  deluxe: 'Deluxe',
}

type BookingSummaryProps = {
  hotel: Hotel
  room: Room
  checkIn: Date
  checkOut: Date
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="space-y-0.5 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium leading-tight">{value}</p>
      </div>
    </div>
  )
}

export function BookingSummary({ hotel, room, checkIn, checkOut }: BookingSummaryProps) {
  const nights = formatNights(checkIn, checkOut)
  const costPerNight = room.baseCost + room.taxes
  const total = costPerNight * Math.max(nights, 1)

  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-primary px-5 py-4">
        <p className="text-xs font-medium text-primary-foreground/70 uppercase tracking-wide">
          Resumen de reserva
        </p>
        <h3 className="text-base font-semibold text-primary-foreground mt-0.5">{hotel.name}</h3>
        <p className="text-xs text-primary-foreground/70">{hotel.city}</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Detalles */}
        <div className="space-y-3">
          <SummaryRow
            icon={BedDouble}
            label="Habitación"
            value={`${ROOM_TYPE_LABELS[room.type]} · ${room.location}`}
          />
          <SummaryRow
            icon={Users}
            label="Capacidad"
            value={`${room.capacity} ${room.capacity === 1 ? 'persona' : 'personas'}`}
          />
          <SummaryRow icon={Calendar} label="Check-in" value={formatDate(checkIn)} />
          <SummaryRow icon={Calendar} label="Check-out" value={formatDate(checkOut)} />
          <SummaryRow
            icon={MapPin}
            label="Duración"
            value={`${nights} ${nights === 1 ? 'noche' : 'noches'}`}
          />
        </div>

        <Separator />

        {/* Costos */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {formatCurrency(room.baseCost)} × {nights} {nights === 1 ? 'noche' : 'noches'}
            </span>
            <span>{formatCurrency(room.baseCost * Math.max(nights, 1))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Impuestos</span>
            <span>{formatCurrency(room.taxes * Math.max(nights, 1))}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
