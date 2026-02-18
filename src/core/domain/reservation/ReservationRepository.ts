import type { EntityId } from '../shared/types'
import type { Reservation, CreateReservationPayload } from './Reservation'

export interface ReservationRepository {
  findByHotel(hotelId: EntityId): Promise<Reservation[]>
  findById(id: EntityId): Promise<Reservation | null>
  create(payload: CreateReservationPayload): Promise<Reservation>
  updateStatus(id: EntityId, status: Reservation['status']): Promise<Reservation>
  isRoomAvailable(roomId: EntityId, checkIn: Date, checkOut: Date): Promise<boolean>
}
