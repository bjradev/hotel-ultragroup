import { useQuery } from '@tanstack/react-query'
import { reservationServices } from '@/core/application/services'

const reservationsQueryKey = (hotelId: string) => ['reservations', hotelId] as const

export function useReservationsByHotel(hotelId: string) {
  return useQuery({
    queryKey: reservationsQueryKey(hotelId),
    queryFn: () => reservationServices.getByHotel.execute(hotelId),
    enabled: Boolean(hotelId),
  })
}
