import { describe, it, expect, vi } from 'vitest'
import { CreateReservationUseCase } from '../CreateReservationUseCase'
import { ConflictError, ValidationError } from '../../../domain/shared/errors'
import type { ReservationRepository } from '../../../domain/reservation/ReservationRepository'
import type { CreateReservationPayload } from '../../../domain/reservation/Reservation'

function makePayload(overrides?: Partial<CreateReservationPayload>): CreateReservationPayload {
  return {
    hotelId: 'hotel-1',
    roomId: 'room-1',
    checkIn: new Date('2026-03-01T14:00:00Z'),
    checkOut: new Date('2026-03-03T12:00:00Z'),
    totalCost: 300_000,
    guest: {
      fullName: 'Carlos Ramírez',
      birthDate: new Date('1990-05-15'),
      gender: 'male',
      documentType: 'cc',
      documentNumber: '1019234567',
      email: 'carlos@email.com',
      phone: '+57 310 234 5678',
    },
    emergencyContact: {
      fullName: 'María Ramírez',
      phone: '+57 310 987 6543',
    },
    ...overrides,
  }
}

function makeMockRepo(overrides?: Partial<ReservationRepository>): ReservationRepository {
  return {
    findByHotel: vi.fn(),
    findById: vi.fn(),
    create: vi.fn().mockImplementation(async (p) => ({
      ...p,
      id: 'res-1',
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    updateStatus: vi.fn(),
    isRoomAvailable: vi.fn().mockResolvedValue(true),
    ...overrides,
  }
}

describe('CreateReservationUseCase', () => {
  it('crea una reserva cuando los datos son válidos y la habitación está disponible', async () => {
    const repo = makeMockRepo()
    const useCase = new CreateReservationUseCase(repo)
    const payload = makePayload()

    const result = await useCase.execute(payload)

    expect(result.id).toBe('res-1')
    expect(result.status).toBe('confirmed')
    expect(repo.isRoomAvailable).toHaveBeenCalledWith(
      'room-1',
      payload.checkIn,
      payload.checkOut,
    )
    expect(repo.create).toHaveBeenCalledWith(payload)
  })

  it('lanza ValidationError si check-out es igual o anterior a check-in', async () => {
    const repo = makeMockRepo()
    const useCase = new CreateReservationUseCase(repo)

    const sameDate = makePayload({
      checkIn: new Date('2026-03-01'),
      checkOut: new Date('2026-03-01'),
    })
    await expect(useCase.execute(sameDate)).rejects.toThrow(ValidationError)

    const reversed = makePayload({
      checkIn: new Date('2026-03-05'),
      checkOut: new Date('2026-03-01'),
    })
    await expect(useCase.execute(reversed)).rejects.toThrow(ValidationError)

    expect(repo.isRoomAvailable).not.toHaveBeenCalled()
  })

  it('lanza ConflictError si la habitación no está disponible', async () => {
    const repo = makeMockRepo({ isRoomAvailable: vi.fn().mockResolvedValue(false) })
    const useCase = new CreateReservationUseCase(repo)

    await expect(useCase.execute(makePayload())).rejects.toThrow(ConflictError)
    expect(repo.create).not.toHaveBeenCalled()
  })

  it('lanza ValidationError si el email del huésped es inválido', async () => {
    const repo = makeMockRepo()
    const useCase = new CreateReservationUseCase(repo)

    const payload = makePayload({
      guest: {
        ...makePayload().guest,
        email: 'correo-invalido',
      },
    })

    await expect(useCase.execute(payload)).rejects.toThrow(ValidationError)
    expect(repo.create).not.toHaveBeenCalled()
  })
})
