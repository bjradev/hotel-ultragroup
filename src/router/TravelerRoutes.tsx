import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import TravelerLayout from '@/shared/components/layout/TravelerLayout'
import { FullPageLoader } from '@/shared/components/common/LoadingSpinner'

const SearchPage = lazy(() => import('@/modules/traveler/search/pages/SearchPage'))
const HotelDetailPage = lazy(() => import('@/modules/traveler/hotel-detail/pages/HotelDetailPage'))
const BookingPage = lazy(() => import('@/modules/traveler/booking/pages/BookingPage'))
const ConfirmationPage = lazy(() => import('@/modules/traveler/booking/pages/ConfirmationPage'))

export default function TravelerRoutes() {
  return (
    <Routes>
      <Route element={<TravelerLayout />}>
        <Route index element={<Navigate to="search" replace />} />
        <Route
          path="search"
          element={
            <Suspense fallback={<FullPageLoader />}>
              <SearchPage />
            </Suspense>
          }
        />
        <Route
          path="hotels/:hotelId"
          element={
            <Suspense fallback={<FullPageLoader />}>
              <HotelDetailPage />
            </Suspense>
          }
        />
        <Route
          path="hotels/:hotelId/book/:roomId"
          element={
            <Suspense fallback={<FullPageLoader />}>
              <BookingPage />
            </Suspense>
          }
        />
        <Route
          path="booking/confirmation"
          element={
            <Suspense fallback={<FullPageLoader />}>
              <ConfirmationPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}
