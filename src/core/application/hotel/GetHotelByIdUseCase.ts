import type { HotelRepository } from '../../domain/hotel/HotelRepository'
import type { Hotel } from '../../domain/hotel/Hotel'
import { NotFoundError } from '../../domain/shared/errors'

export class GetHotelByIdUseCase {
  constructor(private readonly hotelRepository: HotelRepository) {}

  async execute(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findById(id)
    if (!hotel) throw new NotFoundError('Hotel', id)
    return hotel
  }
}
