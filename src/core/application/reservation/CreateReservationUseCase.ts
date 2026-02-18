import type { ReservationRepository } from '../../domain/reservation/ReservationRepository'
import type { Reservation, CreateReservationPayload } from '../../domain/reservation/Reservation'
import { ConflictError, ValidationError } from '../../domain/shared/errors'

export class CreateReservationUseCase {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async execute(payload: CreateReservationPayload): Promise<Reservation> {
    if (payload.checkOut <= payload.checkIn) {
      throw new ValidationError('La fecha de salida debe ser posterior a la fecha de entrada')
    }

    const isAvailable = await this.reservationRepository.isRoomAvailable(
      payload.roomId,
      payload.checkIn,
      payload.checkOut,
    )

    if (!isAvailable) {
      throw new ConflictError('La habitación no está disponible para las fechas seleccionadas')
    }

    if (!payload.guest.email.includes('@')) {
      throw new ValidationError('El email del huésped no es válido')
    }

    return this.reservationRepository.create(payload)
  }
}
