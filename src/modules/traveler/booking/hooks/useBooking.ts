import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { roomServices, reservationServices } from '@/core/application/services'
import { useBookingStore } from '@/store/bookingStore'
import { formatNights } from '@/shared/lib/formatters'
import type { CreateReservationPayload } from '@/core/domain/reservation'

export function useRoomById(roomId: string) {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: () => roomServices.getById.execute(roomId),
    enabled: Boolean(roomId),
  })
}

export function useCreateReservation() {
  const navigate = useNavigate()
  const { setLastReservation, clearBooking } = useBookingStore()

  return useMutation({
    mutationFn: (payload: CreateReservationPayload) =>
      reservationServices.create.execute(payload),
    onSuccess: (reservation) => {
      setLastReservation(reservation)
      clearBooking()
      toast.success('Reserva confirmada exitosamente')
      navigate('/traveler/booking/confirmation')
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Error al confirmar la reserva')
    },
  })
}

export function calculateBookingTotal(
  baseCost: number,
  taxes: number,
  checkIn: Date,
  checkOut: Date,
): number {
  const nights = formatNights(checkIn, checkOut)
  return (baseCost + taxes) * Math.max(nights, 1)
}
