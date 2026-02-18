import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { hotelServices } from '@/core/application/services'
import type { CreateHotelPayload, UpdateHotelPayload } from '@/core/domain/hotel'

export const HOTELS_QUERY_KEY = ['hotels'] as const

export function useHotels() {
  return useQuery({
    queryKey: HOTELS_QUERY_KEY,
    queryFn: () => hotelServices.getAll.execute(),
  })
}

export function useHotelById(id: string) {
  return useQuery({
    queryKey: [...HOTELS_QUERY_KEY, id],
    queryFn: () => hotelServices.getById.execute(id),
    enabled: Boolean(id),
  })
}

export function useCreateHotel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateHotelPayload) => hotelServices.create.execute(payload),
    onSuccess: (hotel) => {
      queryClient.invalidateQueries({ queryKey: HOTELS_QUERY_KEY })
      toast.success(`Hotel "${hotel.name}" creado exitosamente`)
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Error al crear el hotel')
    },
  })
}

export function useUpdateHotel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHotelPayload }) =>
      hotelServices.update.execute(id, payload),
    onSuccess: (hotel) => {
      queryClient.invalidateQueries({ queryKey: HOTELS_QUERY_KEY })
      toast.success(`Hotel "${hotel.name}" actualizado`)
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Error al actualizar el hotel')
    },
  })
}

export function useToggleHotelStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      hotelServices.toggleStatus.execute(id, isEnabled),
    onSuccess: (hotel) => {
      queryClient.invalidateQueries({ queryKey: HOTELS_QUERY_KEY })
      const label = hotel.isEnabled ? 'habilitado' : 'deshabilitado'
      toast.success(`Hotel "${hotel.name}" ${label}`)
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Error al cambiar el estado del hotel')
    },
  })
}
