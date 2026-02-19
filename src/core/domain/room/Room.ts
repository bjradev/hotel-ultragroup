import type { EntityId } from '../shared/types'

export type RoomType = 'single' | 'double' | 'suite' | 'family' | 'deluxe'

export type Room = {
  id: EntityId
  hotelId: EntityId
  type: RoomType
  baseCost: number
  taxes: number
  location: string
  capacity: number
  isEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export type CreateRoomPayload = Omit<Room, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateRoomPayload = Partial<Omit<Room, 'id' | 'hotelId' | 'createdAt' | 'updatedAt'>>
