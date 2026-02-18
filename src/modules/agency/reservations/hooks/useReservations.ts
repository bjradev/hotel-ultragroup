import { useQuery } from '@tanstack/react-query'
import { reservationServices } from '@/core/application/services'

export const reservationsQueryKey = (hotelId: string) => ['reservations', hotelId] as const

export function useReservationsByHotel(hotelId: string) {
  return useQuery({
    queryKey: reservationsQueryKey(hotelId),
    queryFn: () => reservationServices.getByHotel.execute(hotelId),
    enabled: Boolean(hotelId),
  })
}

export function useReservationById(id: string) {
  return useQuery({
    queryKey: ['reservation', id],
    queryFn: () => reservationServices.getById.execute(id),
    enabled: Boolean(id),
  })
}
