import { supabase } from '../client'
import { toHotel, toHotelInsert, toHotelUpdate } from '../mappers'
import type { HotelRow } from '../mappers'
import type { HotelRepository } from '@/core/domain/hotel/HotelRepository'
import type { Hotel, CreateHotelPayload, UpdateHotelPayload } from '@/core/domain/hotel'
import type { EntityId } from '@/core/domain/shared/types'

const TABLE = 'hotels'

function assertData<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message)
  return data as T
}

export const hotelRepository: HotelRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })

    return assertData<HotelRow[]>(data, error).map(toHotel)
  },

  async findById(id: EntityId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data ? toHotel(data as HotelRow) : null
  },

  async findByCity(city: string) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .ilike('city', `%${city}%`)
      .order('stars', { ascending: false })

    return assertData<HotelRow[]>(data, error).map(toHotel)
  },

  async create(payload: CreateHotelPayload): Promise<Hotel> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(toHotelInsert(payload))
      .select()
      .single()

    return toHotel(assertData<HotelRow>(data, error))
  },

  async update(id: EntityId, payload: UpdateHotelPayload): Promise<Hotel> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...toHotelUpdate(payload), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    return toHotel(assertData<HotelRow>(data, error))
  },

  async toggleStatus(id: EntityId, isEnabled: boolean): Promise<Hotel> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    return toHotel(assertData<HotelRow>(data, error))
  },

  async delete(id: EntityId) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}
