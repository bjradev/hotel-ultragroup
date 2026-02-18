import type { EntityId } from '../shared/types'

export type Hotel = {
  id: EntityId
  name: string
  description: string
  city: string
  address: string
  stars: number
  isEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export type CreateHotelPayload = Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateHotelPayload = Partial<Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>>
