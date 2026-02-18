import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from '@tanstack/react-form'
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Separator } from '@/shared/components/ui/separator'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { BookingSummary } from '../components/BookingSummary'
import { useRoomById, useCreateReservation, calculateBookingTotal } from '../hooks/useBooking'
import { useTravelerHotelById } from '../../search/hooks/useHotelSearch'
import { useBookingStore } from '@/store/bookingStore'
import { resolveCheckOut } from '@/shared/lib/formatters'
import type { Gender, DocumentType } from '@/core/domain/reservation'

type GuestFormValues = {
  fullName: string
  birthDate: string
  gender: Gender | ''
  documentType: DocumentType | ''
  documentNumber: string
  email: string
  phone: string
  emergencyName: string
  emergencyPhone: string
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive mt-1">{message}</p>
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function BookingPage() {
  const { hotelId = '', roomId = '' } = useParams<{ hotelId: string; roomId: string }>()
  const navigate = useNavigate()
  const { checkIn, checkOut } = useBookingStore()
  const [redirecting, setRedirecting] = useState(false)

  const { data: hotel, isLoading: isLoadingHotel } = useTravelerHotelById(hotelId)
  const { data: room, isLoading: isLoadingRoom } = useRoomById(roomId)
  const createReservation = useCreateReservation()

  const isLoading = isLoadingHotel || isLoadingRoom

  // check-in es el mínimo requerido para reservar; check-out se infiere si no existe
  const effectiveCheckOut = checkIn ? resolveCheckOut(checkIn, checkOut) : null

  useEffect(() => {
    if (!checkIn && !isLoading) {
      setRedirecting(true)
      navigate(`/traveler/hotels/${hotelId}`, { replace: true })
    }
  }, [checkIn, isLoading, hotelId, navigate])

  const form = useForm({
    defaultValues: {
      fullName: '',
      birthDate: '',
      gender: '' as Gender | '',
      documentType: '' as DocumentType | '',
      documentNumber: '',
      email: '',
      phone: '',
      emergencyName: '',
      emergencyPhone: '',
    } satisfies GuestFormValues,
    onSubmit: async ({ value }) => {
      if (!room || !hotel || !checkIn || !effectiveCheckOut) return

      const totalCost = calculateBookingTotal(
        room.baseCost,
        room.taxes,
        checkIn,
        effectiveCheckOut,
      )

      await createReservation.mutateAsync({
        hotelId,
        roomId,
        checkIn,
        checkOut: effectiveCheckOut,
        totalCost,
        guest: {
          fullName: value.fullName,
          birthDate: new Date(value.birthDate),
          gender: value.gender as Gender,
          documentType: value.documentType as DocumentType,
          documentNumber: value.documentNumber,
          email: value.email,
          phone: value.phone,
        },
        emergencyContact: {
          fullName: value.emergencyName,
          phone: value.emergencyPhone,
        },
      })
    },
  })

  if (redirecting || (!checkIn && !isLoading)) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Back */}
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
        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-8"
        >
          {/* Datos del huésped */}
          <FormSection title="Datos del huésped">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <form.Field
                  name="fullName"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim() ? 'El nombre completo es requerido' : undefined,
                  }}
                >
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">
                        Nombre completo <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Carlos Andrés Ramírez"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError message={field.state.meta.errors[0] as string | undefined} />
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field
                name="birthDate"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'La fecha de nacimiento es requerida' : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="birthDate">
                      Fecha de nacimiento <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError message={field.state.meta.errors[0] as string | undefined} />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="gender"
                validators={{
                  onChange: ({ value }) => (!value ? 'El género es requerido' : undefined),
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <Label>
                      Género <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) => field.handleChange(v as Gender)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Femenino</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError message={field.state.meta.errors[0] as string | undefined} />
                  </div>
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
                  <div className="space-y-1.5">
                    <Label>
                      Tipo de documento <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) => field.handleChange(v as DocumentType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cc">Cédula de ciudadanía</SelectItem>
                        <SelectItem value="passport">Pasaporte</SelectItem>
                        <SelectItem value="ce">Cédula de extranjería</SelectItem>
                        <SelectItem value="nit">NIT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError message={field.state.meta.errors[0] as string | undefined} />
                  </div>
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
                  <div className="space-y-1.5">
                    <Label htmlFor="documentNumber">
                      Número de documento <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="documentNumber"
                      placeholder="1019234567"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError message={field.state.meta.errors[0] as string | undefined} />
                  </div>
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
                  <div className="space-y-1.5">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="usuario@email.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError message={field.state.meta.errors[0] as string | undefined} />
                  </div>
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
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">
                      Teléfono <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+57 310 234 5678"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError message={field.state.meta.errors[0] as string | undefined} />
                  </div>
                )}
              </form.Field>
            </div>
          </FormSection>

          <Separator />

          {/* Contacto de emergencia */}
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
                  <div className="space-y-1.5">
                    <Label htmlFor="emergencyName">
                      Nombre completo <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="emergencyName"
                      placeholder="María Ramírez"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError message={field.state.meta.errors[0] as string | undefined} />
                  </div>
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
                  <div className="space-y-1.5">
                    <Label htmlFor="emergencyPhone">
                      Teléfono <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      placeholder="+57 310 987 6543"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError message={field.state.meta.errors[0] as string | undefined} />
                  </div>
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

        {/* Summary */}
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
                  <Skeleton key={i} className="h-4 w-full" />
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
