import type { RoomRepository } from '../../domain/room/RoomRepository'
import type { Room } from '../../domain/room/Room'
import { NotFoundError } from '../../domain/shared/errors'

export class GetRoomByIdUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(id: string): Promise<Room> {
    const room = await this.roomRepository.findById(id)
    if (!room) throw new NotFoundError('Habitacion', id)
    return room
  }
}
