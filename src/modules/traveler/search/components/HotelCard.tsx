import { useNavigate } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { Hotel } from '@/core/domain/hotel'

type HotelCardProps = {
  hotel: Hotel
  onSelect: (hotel: Hotel) => void
}

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="text-amber-400 tracking-tighter text-sm" aria-label={`${stars} estrellas`}>
      {'★'.repeat(stars)}
      <span className="text-muted-foreground/25">{'★'.repeat(5 - stars)}</span>
    </span>
  )
}

export function HotelCard({ hotel, onSelect }: HotelCardProps) {
  const navigate = useNavigate()

  function handleSelect() {
    onSelect(hotel)
    navigate(`/traveler/hotels/${hotel.id}`)
  }

  return (
    <article className="bg-card border rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>
          <StarRating stars={hotel.stars} />
        </div>
        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 text-primary font-bold text-lg">
          {hotel.stars}★
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">
          {hotel.address}, {hotel.city}
        </span>
      </div>

      {/* Description */}
      {hotel.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {hotel.description}
        </p>
      )}

      {/* CTA */}
      <Button onClick={handleSelect} className="w-full gap-2 mt-auto" variant="outline">
        Ver habitaciones
        <ArrowRight className="h-4 w-4" />
      </Button>
    </article>
  )
}
