import type { RoomRepository } from '../../domain/room/RoomRepository'
import type { Room } from '../../domain/room/Room'

export class GetRoomsByHotelUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(hotelId: string): Promise<Room[]> {
    return this.roomRepository.findByHotel(hotelId)
  }
}
