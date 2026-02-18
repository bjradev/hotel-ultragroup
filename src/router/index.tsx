import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AgencyRoutes from './AgencyRoutes'
import TravelerRoutes from './TravelerRoutes'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/traveler/search" replace />} />
        <Route path="/agency/*" element={<AgencyRoutes />} />
        <Route path="/traveler/*" element={<TravelerRoutes />} />
        <Route path="*" element={<Navigate to="/traveler/search" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
