import type { EntityId } from '../shared/types'
import type { Room, CreateRoomPayload, UpdateRoomPayload } from './Room'

export interface RoomRepository {
  findByHotel(hotelId: EntityId): Promise<Room[]>
  findAvailableByHotel(hotelId: EntityId, checkIn: Date, checkOut: Date): Promise<Room[]>
  findById(id: EntityId): Promise<Room | null>
  create(payload: CreateRoomPayload): Promise<Room>
  update(id: EntityId, payload: UpdateRoomPayload): Promise<Room>
  toggleStatus(id: EntityId, isEnabled: boolean): Promise<Room>
  delete(id: EntityId): Promise<void>
}
