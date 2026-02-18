import type { RoomRepository } from '../../domain/room/RoomRepository'
import type { Room, UpdateRoomPayload } from '../../domain/room/Room'
import { NotFoundError, ValidationError } from '../../domain/shared/errors'

export class UpdateRoomUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(id: string, payload: UpdateRoomPayload): Promise<Room> {
    const existing = await this.roomRepository.findById(id)
    if (!existing) throw new NotFoundError('Habitación', id)

    if (payload.baseCost !== undefined && payload.baseCost <= 0) {
      throw new ValidationError('El costo base debe ser mayor a 0')
    }
    if (payload.taxes !== undefined && payload.taxes < 0) {
      throw new ValidationError('Los impuestos no pueden ser negativos')
    }

    return this.roomRepository.update(id, payload)
  }
}
