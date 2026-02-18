import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/shared/components/ui/sheet'
import { Separator } from '@/shared/components/ui/separator'
import { ReservationStatusBadge } from './ReservationStatusBadge'
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

const GENDER_LABELS: Record<string, string> = {
  male: 'Masculino',
  female: 'Femenino',
  other: 'Otro',
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  cc: 'Cedula de ciudadania',
  passport: 'Pasaporte',
  ce: 'Cedula de extranjeria',
  nit: 'NIT',
}

type DetailRowProps = {
  label: string
  value: string | number | undefined
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value ?? '—'}</span>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pt-2">
      {children}
    </p>
  )
}

type ReservationDetailSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  reservation: Reservation | null
  room?: Room | null
}

export function ReservationDetailSheet({
  open,
  onOpenChange,
  reservation,
  room,
}: ReservationDetailSheetProps) {
  if (!reservation) return null

  const nights = formatNights(reservation.checkIn, reservation.checkOut)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <div>
              <SheetTitle>Detalle de reserva</SheetTitle>
              <SheetDescription className="mt-1 font-mono text-xs">
                #{reservation.id.slice(0, 8).toUpperCase()}
              </SheetDescription>
            </div>
            <ReservationStatusBadge status={reservation.status} />
          </div>
        </SheetHeader>

        <div className="space-y-4 px-6 py-5">
          {/* Informacion de la reserva */}
          <div className="space-y-1">
            <SectionTitle>Reserva</SectionTitle>
            <DetailRow label="Check-in" value={formatDate(reservation.checkIn)} />
            <DetailRow label="Check-out" value={formatDate(reservation.checkOut)} />
            <DetailRow label="Noches" value={nights} />
            {room && (
              <DetailRow label="Habitacion" value={`${ROOM_TYPE_LABELS[room.type]} · ${room.location}`} />
            )}
            <DetailRow label="Costo total" value={formatCurrency(reservation.totalCost)} />
          </div>

          <Separator />

          {/* Datos del huesped */}
          <div className="space-y-1">
            <SectionTitle>Huesped</SectionTitle>
            <DetailRow label="Nombre completo" value={reservation.guest.fullName} />
            <DetailRow
              label="Fecha de nacimiento"
              value={formatDate(new Date(reservation.guest.birthDate))}
            />
            <DetailRow label="Genero" value={GENDER_LABELS[reservation.guest.gender]} />
            <DetailRow
              label="Documento"
              value={`${DOCUMENT_TYPE_LABELS[reservation.guest.documentType]} ${reservation.guest.documentNumber}`}
            />
            <DetailRow label="Email" value={reservation.guest.email} />
            <DetailRow label="Telefono" value={reservation.guest.phone} />
          </div>

          <Separator />

          {/* Contacto de emergencia */}
          <div className="space-y-1">
            <SectionTitle>Contacto de emergencia</SectionTitle>
            <DetailRow label="Nombre" value={reservation.emergencyContact.fullName} />
            <DetailRow label="Telefono" value={reservation.emergencyContact.phone} />
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-1">
            <SectionTitle>Registro</SectionTitle>
            <DetailRow label="Creada el" value={formatDate(reservation.createdAt)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
