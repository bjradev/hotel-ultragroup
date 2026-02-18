import type { HotelRepository } from '../../domain/hotel/HotelRepository'
import type { Hotel } from '../../domain/hotel/Hotel'
import { ValidationError } from '../../domain/shared/errors'

export type HotelSearchParams = {
  city: string
  checkIn: Date
  checkOut?: Date
}

export class SearchHotelsByCityUseCase {
  constructor(private readonly hotelRepository: HotelRepository) {}

  async execute(params: HotelSearchParams): Promise<Hotel[]> {
    if (!params.city.trim()) throw new ValidationError('La ciudad es requerida para buscar hoteles')
    if (!params.checkIn) throw new ValidationError('La fecha de entrada es requerida')
    if (params.checkOut && params.checkOut <= params.checkIn) {
      throw new ValidationError('La fecha de salida debe ser posterior a la fecha de entrada')
    }

    const hotels = await this.hotelRepository.findByCity(params.city.trim())
    return hotels.filter((h) => h.isEnabled)
  }
}
