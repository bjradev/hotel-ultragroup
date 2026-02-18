import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Calendar, Mail, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { useBookingStore } from '@/store/bookingStore'
import { formatDate, formatCurrency, formatNights } from '@/shared/lib/formatters'

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  cc: 'C.C.',
  passport: 'Pasaporte',
  ce: 'C.E.',
  nit: 'NIT',
}

export default function ConfirmationPage() {
  const navigate = useNavigate()
  const { lastReservation } = useBookingStore()

  useEffect(() => {
    if (!lastReservation) {
      navigate('/traveler/search', { replace: true })
    }
  }, [lastReservation, navigate])

  if (!lastReservation) return null

  const { guest, emergencyContact, checkIn, checkOut, totalCost } = lastReservation
  const checkInDate = checkIn instanceof Date ? checkIn : new Date(checkIn)
  const checkOutDate = checkOut instanceof Date ? checkOut : new Date(checkOut)
  const nights = formatNights(checkInDate, checkOutDate)

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Hero de éxito */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Reserva confirmada</h1>
          <p className="text-muted-foreground">
            Hemos enviado los detalles a{' '}
            <span className="font-medium text-foreground">{guest.email}</span>
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm">
          <span className="text-muted-foreground">Número de reserva:</span>
          <span className="font-mono font-semibold">
            #{lastReservation.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Detalles de la reserva */}
      <div className="bg-card border rounded-xl overflow-hidden">
        {/* Fechas */}
        <div className="grid grid-cols-3 divide-x">
          <div className="p-4 text-center space-y-0.5">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Calendar className="h-3 w-3" /> Check-in
            </p>
            <p className="text-sm font-semibold">{formatDate(checkInDate)}</p>
          </div>
          <div className="p-4 text-center space-y-0.5">
            <p className="text-xs text-muted-foreground">Noches</p>
            <p className="text-2xl font-bold">{nights}</p>
          </div>
          <div className="p-4 text-center space-y-0.5">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Calendar className="h-3 w-3" /> Check-out
            </p>
            <p className="text-sm font-semibold">{formatDate(checkOutDate)}</p>
          </div>
        </div>

        <Separator />

        <div className="p-5 space-y-5">
          {/* Costo */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total pagado</p>
              <p className="text-base font-bold">{formatCurrency(totalCost)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Duración</p>
              <p className="text-sm font-medium">
                {nights} {nights === 1 ? 'noche' : 'noches'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Huésped */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Huésped
            </p>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Nombre</p>
                <p className="font-medium">{guest.fullName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Documento</p>
                <p className="font-medium">
                  {DOCUMENT_TYPE_LABELS[guest.documentType]} {guest.documentNumber}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {guest.email}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Teléfono</p>
                <p className="font-medium">{guest.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contacto emergencia */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contacto de emergencia
            </p>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Nombre</p>
                <p className="font-medium">{emergencyContact.fullName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Teléfono</p>
                <p className="font-medium">{emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => navigate('/traveler/search')} className="gap-2">
          <Search className="h-4 w-4" />
          Hacer otra reserva
        </Button>
        <Button variant="outline" onClick={() => navigate('/agency/hotels')}>
          Ir al panel de agencia
        </Button>
      </div>
    </div>
  )
}
