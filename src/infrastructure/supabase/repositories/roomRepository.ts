import { supabase } from '../client'
import { toRoom, toRoomInsert, toRoomUpdate } from '../mappers'
import type { RoomRow, ReservationRow } from '../mappers'
import type { RoomRepository } from '@/core/domain/room/RoomRepository'
import type { Room, CreateRoomPayload, UpdateRoomPayload } from '@/core/domain/room'
import type { EntityId } from '@/core/domain/shared/types'

const TABLE = 'rooms'

function assertData<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message)
  return data as T
}

export const roomRepository: RoomRepository = {
  async findByHotel(hotelId: EntityId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('hotel_id', hotelId)
      .order('type')

    return assertData<RoomRow[]>(data, error).map(toRoom)
  },

  async findAvailableByHotel(hotelId: EntityId, checkIn: Date, checkOut: Date) {
    const { data: rooms, error: roomsError } = await supabase
      .from(TABLE)
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('is_enabled', true)

    const allRooms = assertData<RoomRow[]>(rooms, roomsError)

    if (allRooms.length === 0) return []

    const roomIds = allRooms.map((r) => r.id)

    const { data: conflicts, error: conflictsError } = await supabase
      .from('reservations')
      .select('room_id')
      .in('room_id', roomIds)
      .neq('status', 'cancelled')
      .lt('check_in', checkOut.toISOString())
      .gt('check_out', checkIn.toISOString())

    const conflicting = assertData<Pick<ReservationRow, 'room_id'>[]>(conflicts, conflictsError)
    const occupiedIds = new Set(conflicting.map((r) => r.room_id))

    return allRooms.filter((r) => !occupiedIds.has(r.id)).map(toRoom)
  },

  async findById(id: EntityId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data ? toRoom(data as RoomRow) : null
  },

  async create(payload: CreateRoomPayload): Promise<Room> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(toRoomInsert(payload))
      .select()
      .single()

    return toRoom(assertData<RoomRow>(data, error))
  },

  async update(id: EntityId, payload: UpdateRoomPayload): Promise<Room> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...toRoomUpdate(payload), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    return toRoom(assertData<RoomRow>(data, error))
  },

  async toggleStatus(id: EntityId, isEnabled: boolean): Promise<Room> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    return toRoom(assertData<RoomRow>(data, error))
  },

  async delete(id: EntityId) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}
