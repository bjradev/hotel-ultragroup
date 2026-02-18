import type { EntityId } from '../shared/types'
import type { Guest, EmergencyContact } from './Guest'

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type Reservation = {
  id: EntityId
  hotelId: EntityId
  roomId: EntityId
  guest: Guest
  emergencyContact: EmergencyContact
  checkIn: Date
  checkOut: Date
  totalCost: number
  status: ReservationStatus
  createdAt: Date
  updatedAt: Date
}

export type CreateReservationPayload = Omit<Reservation, 'id' | 'status' | 'createdAt' | 'updatedAt'>

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}
