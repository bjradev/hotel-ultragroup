import { useState } from 'react'
import { Search, MapPin, CalendarIcon } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Calendar } from '@/shared/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { useBookingStore } from '@/store/bookingStore'
import { cn } from '@/shared/lib/utils'

type SearchFormProps = {
  onSearch: (city: string, checkIn: Date, checkOut?: Date) => void
  isLoading?: boolean
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const { searchCity, checkIn: storeCheckIn, checkOut: storeCheckOut } = useBookingStore()

  const [city, setCity] = useState(searchCity)
  const [checkIn, setCheckIn] = useState<Date | undefined>(storeCheckIn ?? undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(storeCheckOut ?? undefined)
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [checkOutOpen, setCheckOutOpen] = useState(false)
  const [errors, setErrors] = useState<{ city?: string; checkIn?: string; checkOut?: string }>({})

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function handleCheckInSelect(date: Date | undefined) {
    if (!date) return
    setCheckIn(date)
    if (errors.checkIn) setErrors((p) => ({ ...p, checkIn: undefined }))

    // Auto-asignar check-out = check-in + 1 día (estilo booking.com)
    if (!checkOut || checkOut <= date) {
      setCheckOut(addDays(date, 1))
    }
    setCheckInOpen(false)
  }

  function handleCheckOutSelect(date: Date | undefined) {
    if (!date) return
    setCheckOut(date)
    if (errors.checkOut) setErrors((p) => ({ ...p, checkOut: undefined }))
    setCheckOutOpen(false)
  }

  function validate() {
    const newErrors: typeof errors = {}
    if (!city.trim()) newErrors.city = 'La ciudad es requerida'
    if (!checkIn) newErrors.checkIn = 'La fecha de entrada es requerida'
    if (checkOut && checkIn && checkOut <= checkIn) {
      newErrors.checkOut = 'La salida debe ser posterior a la entrada'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !checkIn) return
    const checkInDate = new Date(checkIn)
    checkInDate.setHours(14, 0, 0, 0)
    let checkOutDate: Date | undefined
    if (checkOut) {
      checkOutDate = new Date(checkOut)
      checkOutDate.setHours(12, 0, 0, 0)
    }
    onSearch(city.trim(), checkInDate, checkOutDate)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-4 items-end">
        {/* Ciudad */}
        <div className="space-y-1.5">
          <Label htmlFor="city" className="flex items-center gap-1.5 text-xs font-medium">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            Ciudad <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            placeholder="Bogotá, Medellín, Cartagena..."
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              if (errors.city) setErrors((p) => ({ ...p, city: undefined }))
            }}
            aria-invalid={Boolean(errors.city)}
            className="h-10"
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>

        {/* Check-in */}
        <div className="space-y-1.5 min-w-44">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            Entrada <span className="text-destructive">*</span>
          </Label>
          <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-10 w-full justify-start text-left font-normal',
                  !checkIn && 'text-muted-foreground',
                  errors.checkIn && 'border-destructive',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? formatDisplayDate(checkIn) : 'Seleccionar'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={handleCheckInSelect}
                disabled={{ before: today }}
                defaultMonth={checkIn ?? today}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
          {errors.checkIn && <p className="text-xs text-destructive">{errors.checkIn}</p>}
        </div>

        {/* Check-out */}
        <div className="space-y-1.5 min-w-44">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            Salida{' '}
            <span className="text-muted-foreground font-normal">(opcional)</span>
          </Label>
          <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-10 w-full justify-start text-left font-normal',
                  !checkOut && 'text-muted-foreground',
                  errors.checkOut && 'border-destructive',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? formatDisplayDate(checkOut) : 'Seleccionar'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={handleCheckOutSelect}
                disabled={{ before: checkIn ? addDays(checkIn, 1) : today }}
                defaultMonth={checkOut ?? (checkIn ? addDays(checkIn, 1) : today)}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
          {errors.checkOut && <p className="text-xs text-destructive">{errors.checkOut}</p>}
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isLoading} className="h-10 gap-2 min-w-32">
          <Search className="h-4 w-4" />
          {isLoading ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>
    </form>
  )
}
