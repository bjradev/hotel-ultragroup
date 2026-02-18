import { useQuery } from '@tanstack/react-query'
import { hotelServices, roomServices } from '@/core/application/services'

export function useSearchHotels(city: string, checkIn: Date | null) {
  return useQuery({
    queryKey: ['hotels', 'search', city],
    queryFn: () =>
      hotelServices.search.execute({
        city,
        checkIn: checkIn!,
      }),
    enabled: Boolean(city.trim()) && Boolean(checkIn),
    staleTime: 1000 * 60 * 2,
  })
}

export function useTravelerHotelById(hotelId: string) {
  return useQuery({
    queryKey: ['hotels', hotelId],
    queryFn: () => hotelServices.getById.execute(hotelId),
    enabled: Boolean(hotelId),
  })
}

export function useAvailableRooms(hotelId: string, checkIn: Date | null, checkOut: Date | null) {
  const hasDates = Boolean(checkIn) && Boolean(checkOut)

  return useQuery({
    queryKey: ['rooms', hotelId, 'available', checkIn?.toISOString(), checkOut?.toISOString()],
    queryFn: () =>
      hasDates
        ? roomServices.getAvailable.execute(hotelId, checkIn!, checkOut!)
        : roomServices.getByHotel.execute(hotelId).then((rooms) => rooms.filter((r) => r.isEnabled)),
    enabled: Boolean(hotelId),
  })
}
