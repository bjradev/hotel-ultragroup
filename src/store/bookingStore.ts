import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Hotel } from '@/core/domain/hotel/Hotel'
import type { Room } from '@/core/domain/room/Room'
import type { Reservation } from '@/core/domain/reservation/Reservation'

type BookingState = {
  searchCity: string
  checkIn: Date | null
  checkOut: Date | null

  selectedHotel: Hotel | null
  selectedRoom: Room | null

  lastReservation: Reservation | null

  setSearchParams: (city: string, checkIn: Date, checkOut?: Date) => void
  setSelectedHotel: (hotel: Hotel | null) => void
  setSelectedRoom: (room: Room | null) => void
  setDates: (checkIn: Date, checkOut?: Date) => void
  setSearchCity: (city: string) => void
  setLastReservation: (reservation: Reservation) => void
  clearBooking: () => void
  clearLastReservation: () => void
}

function reviveDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

const dateAwareStorage = {
  getItem: (name: string) => {
    const raw = localStorage.getItem(name)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      const state = parsed?.state
      if (state) {
        state.checkIn = reviveDate(state.checkIn)
        state.checkOut = reviveDate(state.checkOut)
        if (state.lastReservation) {
          state.lastReservation.checkIn = reviveDate(state.lastReservation.checkIn) ?? state.lastReservation.checkIn
          state.lastReservation.checkOut = reviveDate(state.lastReservation.checkOut) ?? state.lastReservation.checkOut
          state.lastReservation.createdAt = reviveDate(state.lastReservation.createdAt) ?? state.lastReservation.createdAt
          state.lastReservation.updatedAt = reviveDate(state.lastReservation.updatedAt) ?? state.lastReservation.updatedAt
          if (state.lastReservation.guest?.birthDate) {
            state.lastReservation.guest.birthDate = reviveDate(state.lastReservation.guest.birthDate) ?? state.lastReservation.guest.birthDate
          }
        }
      }
      return parsed
    } catch {
      return null
    }
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name: string) => localStorage.removeItem(name),
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      searchCity: '',
      checkIn: null,
      checkOut: null,
      selectedHotel: null,
      selectedRoom: null,
      lastReservation: null,

      setSearchParams: (city, checkIn, checkOut) =>
        set({ searchCity: city, checkIn, checkOut: checkOut ?? null }),
      setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
      setSelectedRoom: (room) => set({ selectedRoom: room }),
      setDates: (checkIn, checkOut) => set({ checkIn, checkOut: checkOut ?? null }),
      setSearchCity: (city) => set({ searchCity: city }),
      setLastReservation: (reservation) => set({ lastReservation: reservation }),
      clearBooking: () =>
        set({
          selectedHotel: null,
          selectedRoom: null,
          checkIn: null,
          checkOut: null,
          searchCity: '',
        }),
      clearLastReservation: () => set({ lastReservation: null }),
    }),
    {
      name: 'ug-booking',
      storage: dateAwareStorage,
      partialize: (state) => ({
        searchCity: state.searchCity,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        lastReservation: state.lastReservation,
      }),
    },
  ),
)
