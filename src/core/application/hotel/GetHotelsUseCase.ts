import type { HotelRepository } from '../../domain/hotel/HotelRepository'
import type { Hotel } from '../../domain/hotel/Hotel'

export class GetHotelsUseCase {
  constructor(private readonly hotelRepository: HotelRepository) {}

  async execute(): Promise<Hotel[]> {
    return this.hotelRepository.findAll()
  }
}
