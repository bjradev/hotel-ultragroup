import type { RoomRepository } from '../../domain/room/RoomRepository'
import type { Room, CreateRoomPayload } from '../../domain/room/Room'
import { ValidationError } from '../../domain/shared/errors'

export class CreateRoomUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(payload: CreateRoomPayload): Promise<Room> {
    if (payload.baseCost <= 0) throw new ValidationError('El costo base debe ser mayor a 0')
    if (payload.taxes < 0) throw new ValidationError('Los impuestos no pueden ser negativos')
    if (!payload.location.trim()) throw new ValidationError('La ubicación es requerida')
    if (payload.capacity <= 0) throw new ValidationError('La capacidad debe ser mayor a 0')

    return this.roomRepository.create(payload)
  }
}
