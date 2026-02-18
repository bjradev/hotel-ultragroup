import type { HotelRepository } from '../../domain/hotel/HotelRepository'
import type { Hotel } from '../../domain/hotel/Hotel'
import { NotFoundError } from '../../domain/shared/errors'

export class ToggleHotelStatusUseCase {
  constructor(private readonly hotelRepository: HotelRepository) {}

  async execute(id: string, isEnabled: boolean): Promise<Hotel> {
    const existing = await this.hotelRepository.findById(id)
    if (!existing) throw new NotFoundError('Hotel', id)

    return this.hotelRepository.toggleStatus(id, isEnabled)
  }
}
