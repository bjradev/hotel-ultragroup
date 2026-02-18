import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { roomServices } from '@/core/application/services'
import type { CreateRoomPayload, UpdateRoomPayload } from '@/core/domain/room'

export const roomsQueryKey = (hotelId: string) => ['rooms', hotelId] as const

export function useRoomsByHotel(hotelId: string) {
  return useQuery({
    queryKey: roomsQueryKey(hotelId),
    queryFn: () => roomServices.getByHotel.execute(hotelId),
    enabled: Boolean(hotelId),
  })
}

export function useCreateRoom(hotelId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<CreateRoomPayload, 'hotelId'>) =>
      roomServices.create.execute({ ...payload, hotelId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomsQueryKey(hotelId) })
      toast.success('Habitacion creada exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Error al crear la habitacion')
    },
  })
}

export function useUpdateRoom(hotelId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRoomPayload }) =>
      roomServices.update.execute(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomsQueryKey(hotelId) })
      toast.success('Habitacion actualizada')
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Error al actualizar la habitacion')
    },
  })
}

export function useToggleRoomStatus(hotelId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      roomServices.toggleStatus.execute(id, isEnabled),
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: roomsQueryKey(hotelId) })
      const label = room.isEnabled ? 'habilitada' : 'deshabilitada'
      toast.success(`Habitacion ${label}`)
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Error al cambiar el estado')
    },
  })
}
