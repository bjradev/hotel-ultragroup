import { useReducer } from 'react'
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

type FormErrors = { city?: string; checkIn?: string; checkOut?: string }

type SearchFormState = {
  city: string
  checkIn: Date | undefined
  checkOut: Date | undefined
  checkInOpen: boolean
  checkOutOpen: boolean
  errors: FormErrors
}

type SearchFormAction =
  | { type: 'SET_CITY'; city: string }
  | { type: 'SELECT_CHECK_IN'; date: Date }
  | { type: 'SELECT_CHECK_OUT'; date: Date }
  | { type: 'TOGGLE_CHECK_IN_POPOVER'; open: boolean }
  | { type: 'TOGGLE_CHECK_OUT_POPOVER'; open: boolean }
  | { type: 'SET_ERRORS'; errors: FormErrors }

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}

function searchFormReducer(state: SearchFormState, action: SearchFormAction): SearchFormState {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, city: action.city, errors: { ...state.errors, city: undefined } }
    case 'SELECT_CHECK_IN': {
      const checkOut =
        !state.checkOut || state.checkOut <= action.date
          ? addDays(action.date, 1)
          : state.checkOut
      return {
        ...state,
        checkIn: action.date,
        checkOut,
        checkInOpen: false,
        errors: { ...state.errors, checkIn: undefined },
      }
    }
    case 'SELECT_CHECK_OUT':
      return {
        ...state,
        checkOut: action.date,
        checkOutOpen: false,
        errors: { ...state.errors, checkOut: undefined },
      }
    case 'TOGGLE_CHECK_IN_POPOVER':
      return { ...state, checkInOpen: action.open }
    case 'TOGGLE_CHECK_OUT_POPOVER':
      return { ...state, checkOutOpen: action.open }
    case 'SET_ERRORS':
      return { ...state, errors: action.errors }
  }
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const { searchCity, checkIn: storeCheckIn, checkOut: storeCheckOut } = useBookingStore()

  const [state, dispatch] = useReducer(searchFormReducer, {
    city: searchCity,
    checkIn: storeCheckIn ?? undefined,
    checkOut: storeCheckOut ?? undefined,
    checkInOpen: false,
    checkOutOpen: false,
    errors: {},
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!state.city.trim()) newErrors.city = 'La ciudad es requerida'
    if (!state.checkIn) newErrors.checkIn = 'La fecha de entrada es requerida'
    if (state.checkOut && state.checkIn && state.checkOut <= state.checkIn) {
      newErrors.checkOut = 'La salida debe ser posterior a la entrada'
    }
    dispatch({ type: 'SET_ERRORS', errors: newErrors })
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !state.checkIn) return
    const checkInDate = new Date(state.checkIn)
    checkInDate.setHours(14, 0, 0, 0)
    let checkOutDate: Date | undefined
    if (state.checkOut) {
      checkOutDate = new Date(state.checkOut)
      checkOutDate.setHours(12, 0, 0, 0)
    }
    onSearch(state.city.trim(), checkInDate, checkOutDate)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-4 items-end">
        <div className="space-y-1.5">
          <Label htmlFor="city" className="flex items-center gap-1.5 text-xs font-medium">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            Ciudad <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            placeholder="Bogotá, Medellín, Cartagena..."
            value={state.city}
            onChange={(e) => dispatch({ type: 'SET_CITY', city: e.target.value })}
            aria-invalid={Boolean(state.errors.city)}
            className="h-10"
          />
          {state.errors.city && <p className="text-xs text-destructive">{state.errors.city}</p>}
        </div>

        <div className="space-y-1.5 min-w-44">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            Entrada <span className="text-destructive">*</span>
          </Label>
          <Popover
            open={state.checkInOpen}
            onOpenChange={(open) => dispatch({ type: 'TOGGLE_CHECK_IN_POPOVER', open })}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-10 w-full justify-start text-left font-normal',
                  !state.checkIn && 'text-muted-foreground',
                  state.errors.checkIn && 'border-destructive',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {state.checkIn ? formatDisplayDate(state.checkIn) : 'Seleccionar'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={state.checkIn}
                onSelect={(date) => date && dispatch({ type: 'SELECT_CHECK_IN', date })}
                disabled={{ before: today }}
                defaultMonth={state.checkIn ?? today}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
          {state.errors.checkIn && (
            <p className="text-xs text-destructive">{state.errors.checkIn}</p>
          )}
        </div>

        <div className="space-y-1.5 min-w-44">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            Salida{' '}
            <span className="text-muted-foreground font-normal">(opcional)</span>
          </Label>
          <Popover
            open={state.checkOutOpen}
            onOpenChange={(open) => dispatch({ type: 'TOGGLE_CHECK_OUT_POPOVER', open })}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-10 w-full justify-start text-left font-normal',
                  !state.checkOut && 'text-muted-foreground',
                  state.errors.checkOut && 'border-destructive',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {state.checkOut ? formatDisplayDate(state.checkOut) : 'Seleccionar'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={state.checkOut}
                onSelect={(date) => date && dispatch({ type: 'SELECT_CHECK_OUT', date })}
                disabled={{ before: state.checkIn ? addDays(state.checkIn, 1) : today }}
                defaultMonth={state.checkOut ?? (state.checkIn ? addDays(state.checkIn, 1) : today)}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
          {state.errors.checkOut && (
            <p className="text-xs text-destructive">{state.errors.checkOut}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="h-10 gap-2 min-w-32">
          <Search className="h-4 w-4" />
          {isLoading ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>
    </form>
  )
}
