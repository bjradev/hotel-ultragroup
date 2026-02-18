import type { ReservationRepository } from '../../domain/reservation/ReservationRepository'
import type { Reservation } from '../../domain/reservation/Reservation'
import { NotFoundError } from '../../domain/shared/errors'

export class GetReservationByIdUseCase {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async execute(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(id)
    if (!reservation) throw new NotFoundError('Reserva', id)
    return reservation
  }
}
