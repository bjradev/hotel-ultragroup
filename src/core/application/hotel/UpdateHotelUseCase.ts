import type { HotelRepository } from '../../domain/hotel/HotelRepository'
import type { Hotel, UpdateHotelPayload } from '../../domain/hotel/Hotel'
import { NotFoundError } from '../../domain/shared/errors'

export class UpdateHotelUseCase {
  constructor(private readonly hotelRepository: HotelRepository) {}

  async execute(id: string, payload: UpdateHotelPayload): Promise<Hotel> {
    const existing = await this.hotelRepository.findById(id)
    if (!existing) throw new NotFoundError('Hotel', id)

    return this.hotelRepository.update(id, payload)
  }
}
