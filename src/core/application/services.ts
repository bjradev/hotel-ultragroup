import {
  hotelRepository,
  roomRepository,
  reservationRepository,
} from '@/infrastructure/supabase/repositories'

import {
  GetHotelsUseCase,
  GetHotelByIdUseCase,
  CreateHotelUseCase,
  UpdateHotelUseCase,
  ToggleHotelStatusUseCase,
  SearchHotelsByCityUseCase,
} from './hotel'

import {
  GetRoomsByHotelUseCase,
  GetRoomByIdUseCase,
  GetAvailableRoomsUseCase,
  CreateRoomUseCase,
  UpdateRoomUseCase,
  ToggleRoomStatusUseCase,
} from './room'

import {
  GetReservationsByHotelUseCase,
  GetReservationByIdUseCase,
  CreateReservationUseCase,
} from './reservation'

export const hotelServices = {
  getAll: new GetHotelsUseCase(hotelRepository),
  getById: new GetHotelByIdUseCase(hotelRepository),
  create: new CreateHotelUseCase(hotelRepository),
  update: new UpdateHotelUseCase(hotelRepository),
  toggleStatus: new ToggleHotelStatusUseCase(hotelRepository),
  search: new SearchHotelsByCityUseCase(hotelRepository),
}

export const roomServices = {
  getByHotel: new GetRoomsByHotelUseCase(roomRepository),
  getById: new GetRoomByIdUseCase(roomRepository),
  getAvailable: new GetAvailableRoomsUseCase(roomRepository),
  create: new CreateRoomUseCase(roomRepository),
  update: new UpdateRoomUseCase(roomRepository),
  toggleStatus: new ToggleRoomStatusUseCase(roomRepository),
}

export const reservationServices = {
  getByHotel: new GetReservationsByHotelUseCase(reservationRepository),
  getById: new GetReservationByIdUseCase(reservationRepository),
  create: new CreateReservationUseCase(reservationRepository),
}
