import type { ReservationRepository } from '../../domain/reservation/ReservationRepository'
import type { Reservation } from '../../domain/reservation/Reservation'

export class GetReservationsByHotelUseCase {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async execute(hotelId: string): Promise<Reservation[]> {
    return this.reservationRepository.findByHotel(hotelId)
  }
}
