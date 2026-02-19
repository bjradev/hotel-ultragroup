import { SearchX } from 'lucide-react'
import { SearchForm } from '../components/SearchForm'
import { HotelCard } from '../components/HotelCard'
import { useSearchHotels } from '../hooks/useHotelSearch'
import { useBookingStore } from '@/store/bookingStore'
import { Skeleton } from '@/shared/components/ui/skeleton'
import type { Hotel as HotelEntity } from '@/core/domain/hotel'

function HotelCardSkeleton() {
  return (
    <div className="bg-card border rounded-xl p-5 space-y-4">
      <div className="flex justify-between gap-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  )
}

export default function SearchPage() {
  const { searchCity, checkIn, checkOut, setSearchParams, setSelectedHotel } = useBookingStore()
  const hasSearched = Boolean(searchCity.trim()) && Boolean(checkIn)

  const { data: hotels = [], isLoading, isFetching } = useSearchHotels(searchCity, checkIn)

  function handleSearch(city: string, checkInDate: Date, checkOutDate?: Date) {
    setSearchParams(city, checkInDate, checkOutDate)
  }

  function handleSelectHotel(hotel: HotelEntity) {
    setSelectedHotel(hotel)
  }

  const loading = isLoading || isFetching

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div
        className="bg-cover bg-center bg-no-repeat h-48 rounded-xl flex flex-col items-center justify-center"
        style={{ backgroundImage: 'url(/hotel-banner.jpg)' }}
      >
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
          Encuentra tu hotel ideal
        </h1>
        <p className="text-muted-foreground text-center text-white">
          Busca entre nuestra selección de hoteles en toda{' '}
          <span className="font-black">Colombia</span>
        </p>
      </div>

      {/* Search form */}
      <SearchForm onSearch={handleSearch} isLoading={loading} />

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">
              {loading
                ? 'Buscando hoteles...'
                : hotels.length > 0
                  ? `${hotels.length} hotel${hotels.length === 1 ? '' : 'es'} en ${searchCity}`
                  : `Sin resultados en ${searchCity}`}
            </h2>
            {!loading && hotels.length > 0 && checkIn && (
              <p className="text-sm text-muted-foreground">
                {checkIn.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
                {checkOut &&
                  ` → ${checkOut.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}`}
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <HotelCardSkeleton key={`hotel-skeleton-${i}`} />
              ))}
            </div>
          ) : hotels.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <SearchX className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No encontramos hoteles disponibles</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Intenta con otra ciudad o ajusta las fechas de tu búsqueda.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} onSelect={handleSelectHotel} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
