import type { RoomRepository } from '../../domain/room/RoomRepository'
import type { Room } from '../../domain/room/Room'
import { ValidationError } from '../../domain/shared/errors'

export class GetAvailableRoomsUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(hotelId: string, checkIn: Date, checkOut: Date): Promise<Room[]> {
    if (checkOut <= checkIn) {
      throw new ValidationError('La fecha de salida debe ser posterior a la fecha de entrada')
    }
    return this.roomRepository.findAvailableByHotel(hotelId, checkIn, checkOut)
  }
}
