import { supabase } from '../client'
import { toReservation, toReservationInsert } from '../mappers'
import type { ReservationRow } from '../mappers'
import type { ReservationRepository } from '@/core/domain/reservation/ReservationRepository'
import type { Reservation, CreateReservationPayload } from '@/core/domain/reservation'
import type { EntityId } from '@/core/domain/shared/types'

const TABLE = 'reservations'

function assertData<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message)
  return data as T
}

export const reservationRepository: ReservationRepository = {
  async findByHotel(hotelId: EntityId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('hotel_id', hotelId)
      .order('created_at', { ascending: false })

    return assertData<ReservationRow[]>(data, error).map(toReservation)
  },

  async findById(id: EntityId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data ? toReservation(data as ReservationRow) : null
  },

  async create(payload: CreateReservationPayload): Promise<Reservation> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(toReservationInsert(payload))
      .select()
      .single()

    return toReservation(assertData<ReservationRow>(data, error))
  },

  async updateStatus(id: EntityId, status: Reservation['status']): Promise<Reservation> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    return toReservation(assertData<ReservationRow>(data, error))
  },

  async isRoomAvailable(roomId: EntityId, checkIn: Date, checkOut: Date) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('id')
      .eq('room_id', roomId)
      .neq('status', 'cancelled')
      .lt('check_in', checkOut.toISOString())
      .gt('check_out', checkIn.toISOString())
      .limit(1)

    if (error) throw new Error(error.message)
    return !data || data.length === 0
  },
}
