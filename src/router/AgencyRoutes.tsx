import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AgencyLayout from '@/shared/components/layout/AgencyLayout'
import { FullPageLoader } from '@/shared/components/common/LoadingSpinner'

const HotelsListPage = lazy(() => import('@/modules/agency/hotels/pages/HotelsListPage'))
const RoomsListPage = lazy(() => import('@/modules/agency/rooms/pages/RoomsListPage'))
const ReservationsListPage = lazy(
  () => import('@/modules/agency/reservations/pages/ReservationsListPage'),
)

export default function AgencyRoutes() {
  return (
    <Routes>
      <Route element={<AgencyLayout />}>
        <Route index element={<Navigate to="hotels" replace />} />
        <Route
          path="hotels"
          element={
            <Suspense fallback={<FullPageLoader />}>
              <HotelsListPage />
            </Suspense>
          }
        />
        <Route
          path="hotels/:hotelId/rooms"
          element={
            <Suspense fallback={<FullPageLoader />}>
              <RoomsListPage />
            </Suspense>
          }
        />
        <Route
          path="hotels/:hotelId/reservations"
          element={
            <Suspense fallback={<FullPageLoader />}>
              <ReservationsListPage />
            </Suspense>
          }
        />
        {/* Redirects de rutas legacy de formulario (el form vive en Sheet) */}
        <Route path="hotels/new" element={<Navigate to="/agency/hotels" replace />} />
        <Route path="hotels/:hotelId/edit" element={<Navigate to="/agency/hotels" replace />} />
        <Route
          path="hotels/:hotelId/rooms/:roomId/edit"
          element={<Navigate to="../rooms" relative="path" replace />}
        />
      </Route>
    </Routes>
  )
}
