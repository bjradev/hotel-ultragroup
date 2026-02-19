import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  TextField,
  DateField,
  SelectField,
  FormSection,
  GENDER_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
} from '../components/GuestFields'
import { BookingSummary } from '../components/BookingSummary'
import { useRoomById } from '../hooks/useBooking'
import { useGuestForm } from '../hooks/useGuestForm'
import { useTravelerHotelById } from '../../search/hooks/useHotelSearch'
import { useBookingStore } from '@/store/bookingStore'
import { resolveCheckOut } from '@/shared/lib/formatters'
import type { Gender, DocumentType } from '@/core/domain/reservation'

export default function BookingPage() {
  const { hotelId = '', roomId = '' } = useParams<{ hotelId: string; roomId: string }>()
  const navigate = useNavigate()
  const { checkIn, checkOut } = useBookingStore()
  const [redirecting, setRedirecting] = useState(false)

  const { data: hotel, isLoading: isLoadingHotel } = useTravelerHotelById(hotelId)
  const { data: room, isLoading: isLoadingRoom } = useRoomById(roomId)
  const isLoading = isLoadingHotel || isLoadingRoom
  const effectiveCheckOut = checkIn ? resolveCheckOut(checkIn, checkOut) : null

  const { form, createReservation } = useGuestForm({
    hotelId,
    roomId,
    hotel,
    room,
    checkIn,
    checkOut: effectiveCheckOut,
  })

  useEffect(() => {
    if (!checkIn && !isLoading) {
      setRedirecting(true)
      navigate(`/traveler/hotels/${hotelId}`, { replace: true })
    }
  }, [checkIn, isLoading, hotelId, navigate])

  if (redirecting || (!checkIn && !isLoading)) {
    return null
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground -ml-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al hotel
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Confirmar reserva</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Ingresa los datos del huésped para completar la reserva
        </p>
      </div>

      {createReservation.isError && (
        <div className="flex items-center gap-2.5 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            {createReservation.error?.message ?? 'Error al crear la reserva. Intenta de nuevo.'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-8"
        >
          <FormSection title="Datos del huésped">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <form.Field
                name="fullName"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? 'El nombre completo es requerido' : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    id="fullName"
                    label="Nombre completo"
                    placeholder="Carlos Andrés Ramírez"
                    colSpan
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors[0] as string | undefined}
                  />
                )}
              </form.Field>

              <form.Field
                name="birthDate"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'La fecha de nacimiento es requerida' : undefined,
                }}
              >
                {(field) => (
                  <DateField
                    id="birthDate"
                    label="Fecha de nacimiento"
                    max={new Date().toISOString().split('T')[0]}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors[0] as string | undefined}
                  />
                )}
              </form.Field>

              <form.Field
                name="gender"
                validators={{
                  onChange: ({ value }) => (!value ? 'El género es requerido' : undefined),
                }}
              >
                {(field) => (
                  <SelectField
                    label="Género"
                    placeholder="Seleccionar..."
                    options={GENDER_OPTIONS}
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as Gender)}
                    error={field.state.meta.errors[0] as string | undefined}
                  />
                )}
              </form.Field>

              <form.Field
                name="documentType"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'El tipo de documento es requerido' : undefined,
                }}
              >
                {(field) => (
                  <SelectField
                    label="Tipo de documento"
                    placeholder="Seleccionar..."
                    options={DOCUMENT_TYPE_OPTIONS}
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as DocumentType)}
                    error={field.state.meta.errors[0] as string | undefined}
                  />
                )}
              </form.Field>

              <form.Field
                name="documentNumber"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? 'El número de documento es requerido' : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    id="documentNumber"
                    label="Número de documento"
                    placeholder="1019234567"
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors[0] as string | undefined}
                  />
                )}
              </form.Field>

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim()
                      ? 'El email es requerido'
                      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                        ? 'Ingresa un email válido'
                        : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    id="email"
                    label="Email"
                    placeholder="usuario@email.com"
                    type="email"
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors[0] as string | undefined}
                  />
                )}
              </form.Field>

              <form.Field
                name="phone"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? 'El teléfono es requerido' : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    id="phone"
                    label="Teléfono"
                    placeholder="+57 310 234 5678"
                    type="tel"
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors[0] as string | undefined}
                  />
                )}
              </form.Field>
            </div>
          </FormSection>

          <Separator />

          <FormSection title="Contacto de emergencia">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <form.Field
                name="emergencyName"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? 'El nombre del contacto es requerido' : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    id="emergencyName"
                    label="Nombre completo"
                    placeholder="María Ramírez"
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors[0] as string | undefined}
                  />
                )}
              </form.Field>

              <form.Field
                name="emergencyPhone"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? 'El teléfono del contacto es requerido' : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    id="emergencyPhone"
                    label="Teléfono"
                    placeholder="+57 310 987 6543"
                    type="tel"
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors[0] as string | undefined}
                  />
                )}
              </form.Field>
            </div>
          </FormSection>

          <Button
            type="submit"
            size="lg"
            disabled={createReservation.isPending || isLoading}
            className="w-full sm:w-auto gap-2"
          >
            {createReservation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {createReservation.isPending ? 'Confirmando reserva...' : 'Confirmar reserva'}
          </Button>
        </form>

        <div className="lg:sticky lg:top-6">
          {isLoading || !hotel || !room || !checkIn || !effectiveCheckOut ? (
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="bg-muted p-5 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="p-5 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={`summary-skeleton-${i}`} className="h-4 w-full" />
                ))}
              </div>
            </div>
          ) : (
            <BookingSummary
              hotel={hotel}
              room={room}
              checkIn={checkIn}
              checkOut={effectiveCheckOut}
            />
          )}
        </div>
      </div>
    </div>
  )
}
