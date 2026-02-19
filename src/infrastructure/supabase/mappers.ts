import type { Hotel, CreateHotelPayload, UpdateHotelPayload } from '@/core/domain/hotel'
import type { Room, CreateRoomPayload, UpdateRoomPayload } from '@/core/domain/room'
import type { Reservation, CreateReservationPayload } from '@/core/domain/reservation'
import type { Guest, EmergencyContact } from '@/core/domain/reservation'

// ─── Supabase row types (snake_case) ────────────────────────────────

export type HotelRow = {
  id: string
  name: string
  description: string
  city: string
  address: string
  stars: number
  is_enabled: boolean
  created_at: string
  updated_at: string
}

export type RoomRow = {
  id: string
  hotel_id: string
  type: string
  base_cost: number
  taxes: number
  location: string
  capacity: number
  is_enabled: boolean
  created_at: string
  updated_at: string
}

type GuestJson = {
  full_name: string
  birth_date: string
  gender: string
  document_type: string
  document_number: string
  email: string
  phone: string
}

type EmergencyContactJson = {
  full_name: string
  phone: string
}

export type ReservationRow = {
  id: string
  hotel_id: string
  room_id: string
  guest: GuestJson
  emergency_contact: EmergencyContactJson
  check_in: string
  check_out: string
  total_cost: number
  status: string
  created_at: string
  updated_at: string
}

// ─── Hotel mappers ──────────────────────────────────────────────────

export function toHotel(row: HotelRow): Hotel {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    city: row.city,
    address: row.address,
    stars: row.stars,
    isEnabled: row.is_enabled,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export function toHotelInsert(payload: CreateHotelPayload) {
  return {
    name: payload.name,
    description: payload.description,
    city: payload.city,
    address: payload.address,
    stars: payload.stars,
    is_enabled: payload.isEnabled,
  }
}

export function toHotelUpdate(payload: UpdateHotelPayload) {
  const row: Record<string, unknown> = {}
  if (payload.name !== undefined) row.name = payload.name
  if (payload.description !== undefined) row.description = payload.description
  if (payload.city !== undefined) row.city = payload.city
  if (payload.address !== undefined) row.address = payload.address
  if (payload.stars !== undefined) row.stars = payload.stars
  if (payload.isEnabled !== undefined) row.is_enabled = payload.isEnabled
  return row
}

// ─── Room mappers ───────────────────────────────────────────────────

export function toRoom(row: RoomRow): Room {
  return {
    id: row.id,
    hotelId: row.hotel_id,
    type: row.type as Room['type'],
    baseCost: row.base_cost,
    taxes: row.taxes,
    location: row.location,
    capacity: row.capacity,
    isEnabled: row.is_enabled,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export function toRoomInsert(payload: CreateRoomPayload) {
  return {
    hotel_id: payload.hotelId,
    type: payload.type,
    base_cost: payload.baseCost,
    taxes: payload.taxes,
    location: payload.location,
    capacity: payload.capacity,
    is_enabled: payload.isEnabled,
  }
}

export function toRoomUpdate(payload: UpdateRoomPayload) {
  const row: Record<string, unknown> = {}
  if (payload.type !== undefined) row.type = payload.type
  if (payload.baseCost !== undefined) row.base_cost = payload.baseCost
  if (payload.taxes !== undefined) row.taxes = payload.taxes
  if (payload.location !== undefined) row.location = payload.location
  if (payload.capacity !== undefined) row.capacity = payload.capacity
  if (payload.isEnabled !== undefined) row.is_enabled = payload.isEnabled
  return row
}

// ─── Reservation mappers ────────────────────────────────────────────

function toGuest(json: GuestJson): Guest {
  return {
    fullName: json.full_name,
    birthDate: new Date(json.birth_date),
    gender: json.gender as Guest['gender'],
    documentType: json.document_type as Guest['documentType'],
    documentNumber: json.document_number,
    email: json.email,
    phone: json.phone,
  }
}

function toEmergencyContact(json: EmergencyContactJson): EmergencyContact {
  return {
    fullName: json.full_name,
    phone: json.phone,
  }
}

export function toReservation(row: ReservationRow): Reservation {
  return {
    id: row.id,
    hotelId: row.hotel_id,
    roomId: row.room_id,
    guest: toGuest(row.guest),
    emergencyContact: toEmergencyContact(row.emergency_contact),
    checkIn: new Date(row.check_in),
    checkOut: new Date(row.check_out),
    totalCost: row.total_cost,
    status: row.status as Reservation['status'],
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export function toReservationInsert(payload: CreateReservationPayload) {
  return {
    hotel_id: payload.hotelId,
    room_id: payload.roomId,
    guest: {
      full_name: payload.guest.fullName,
      birth_date: payload.guest.birthDate.toISOString(),
      gender: payload.guest.gender,
      document_type: payload.guest.documentType,
      document_number: payload.guest.documentNumber,
      email: payload.guest.email,
      phone: payload.guest.phone,
    },
    emergency_contact: {
      full_name: payload.emergencyContact.fullName,
      phone: payload.emergencyContact.phone,
    },
    check_in: payload.checkIn.toISOString(),
    check_out: payload.checkOut.toISOString(),
    total_cost: payload.totalCost,
    status: 'confirmed',
  }
}
