import type { RoomRepository } from '../../domain/room/RoomRepository'
import type { Room } from '../../domain/room/Room'
import { NotFoundError } from '../../domain/shared/errors'

export class ToggleRoomStatusUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(id: string, isEnabled: boolean): Promise<Room> {
    const existing = await this.roomRepository.findById(id)
    if (!existing) throw new NotFoundError('Habitación', id)

    return this.roomRepository.toggleStatus(id, isEnabled)
  }
}
