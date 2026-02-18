import type { HotelRepository } from '../../domain/hotel/HotelRepository'
import type { Hotel, CreateHotelPayload } from '../../domain/hotel/Hotel'
import { ValidationError } from '../../domain/shared/errors'

export class CreateHotelUseCase {
  constructor(private readonly hotelRepository: HotelRepository) {}

  async execute(payload: CreateHotelPayload): Promise<Hotel> {
    if (!payload.name.trim()) throw new ValidationError('El nombre del hotel es requerido')
    if (!payload.city.trim()) throw new ValidationError('La ciudad es requerida')
    if (!payload.address.trim()) throw new ValidationError('La dirección es requerida')

    return this.hotelRepository.create(payload)
  }
}
