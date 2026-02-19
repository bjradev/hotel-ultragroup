import { useForm } from '@tanstack/react-form'
import { calculateBookingTotal, useCreateReservation } from './useBooking'
import type { Hotel } from '@/core/domain/hotel'
import type { Room } from '@/core/domain/room'
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

type UseGuestFormParams = {
  hotelId: string
  roomId: string
  hotel: Hotel | undefined
  room: Room | undefined
  checkIn: Date | null
  checkOut: Date | null
}

export function useGuestForm({ hotelId, roomId, hotel, room, checkIn, checkOut }: UseGuestFormParams) {
  const createReservation = useCreateReservation()

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
      if (!room || !hotel || !checkIn || !checkOut) return

      const totalCost = calculateBookingTotal(room.baseCost, room.taxes, checkIn, checkOut)

      await createReservation.mutateAsync({
        hotelId,
        roomId,
        checkIn,
        checkOut,
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

  return { form, createReservation }
}
