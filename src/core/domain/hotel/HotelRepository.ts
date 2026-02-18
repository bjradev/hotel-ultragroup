import type { EntityId } from '../shared/types'
import type { Hotel, CreateHotelPayload, UpdateHotelPayload } from './Hotel'

export interface HotelRepository {
  findAll(): Promise<Hotel[]>
  findById(id: EntityId): Promise<Hotel | null>
  findByCity(city: string): Promise<Hotel[]>
  create(payload: CreateHotelPayload): Promise<Hotel>
  update(id: EntityId, payload: UpdateHotelPayload): Promise<Hotel>
  toggleStatus(id: EntityId, isEnabled: boolean): Promise<Hotel>
  delete(id: EntityId): Promise<void>
}
