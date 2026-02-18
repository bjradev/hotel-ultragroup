import { useForm } from '@tanstack/react-form'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Switch } from '@/shared/components/ui/switch'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { LoadingSpinner } from '@/shared/components/common/LoadingSpinner'
import { formatCurrency } from '@/shared/lib/formatters'
import type { Room, RoomType } from '@/core/domain/room'

export type RoomFormValues = {
  type: RoomType
  baseCost: number
  taxes: number
  location: string
  capacity: number
  isEnabled: boolean
}

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  single: 'Individual',
  double: 'Doble',
  suite: 'Suite',
  family: 'Familiar',
  deluxe: 'Deluxe',
}

type RoomFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  room?: Room | null
  onSubmit: (values: RoomFormValues) => Promise<void>
  isPending: boolean
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive mt-1">{message}</p>
}

export function RoomForm({ open, onOpenChange, room, onSubmit, isPending }: RoomFormProps) {
  const isEditing = Boolean(room)

  const form = useForm({
    defaultValues: {
      type: (room?.type ?? 'double') as RoomType,
      baseCost: room?.baseCost ?? 0,
      taxes: room?.taxes ?? 0,
      location: room?.location ?? '',
      capacity: room?.capacity ?? 2,
      isEnabled: room?.isEnabled ?? true,
    } satisfies RoomFormValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
      form.reset()
    },
  })

  function handleOpenChange(open: boolean) {
    if (!open) form.reset()
    onOpenChange(open)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar habitacion' : 'Nueva habitacion'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos de la habitacion.'
              : 'Configura los datos de la nueva habitacion para este hotel.'}
          </SheetDescription>
        </SheetHeader>

        <form
          className="flex flex-col gap-5 flex-1 px-6 py-5"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          {/* Tipo y Capacidad */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="type">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="type">
                    Tipo <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as RoomType)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROOM_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field
              name="capacity"
              validators={{
                onChange: ({ value }) =>
                  value <= 0 ? 'La capacidad debe ser mayor a 0' : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="capacity">
                    Capacidad <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    max={20}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                  />
                  <FieldError message={field.state.meta.errors[0] as string | undefined} />
                </div>
              )}
            </form.Field>
          </div>

          {/* Ubicacion */}
          <form.Field
            name="location"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? 'La ubicacion es requerida' : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="location">
                  Ubicacion <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="Piso 3, ala norte"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <FieldError message={field.state.meta.errors[0] as string | undefined} />
              </div>
            )}
          </form.Field>

          {/* Costos */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="baseCost"
                validators={{
                  onChange: ({ value }) =>
                    value <= 0 ? 'El costo base debe ser mayor a 0' : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="baseCost">
                      Costo base <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="baseCost"
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="150000"
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    <FieldError message={field.state.meta.errors[0] as string | undefined} />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="taxes"
                validators={{
                  onChange: ({ value }) =>
                    value < 0 ? 'Los impuestos no pueden ser negativos' : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="taxes">
                      Impuestos <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="taxes"
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="27000"
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    <FieldError message={field.state.meta.errors[0] as string | undefined} />
                  </div>
                )}
              </form.Field>
            </div>

            {/* Costo total calculado */}
            <form.Subscribe selector={(s) => [s.values.baseCost, s.values.taxes]}>
              {([baseCost, taxes]) => {
                const total = (baseCost as number) + (taxes as number)
                if (total <= 0) return null
                return (
                  <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Total por noche</span>
                    <span className="font-semibold">{formatCurrency(total)}</span>
                  </div>
                )
              }}
            </form.Subscribe>
          </div>

          {/* Estado */}
          <form.Field name="isEnabled">
            {(field) => (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isEnabled" className="cursor-pointer">
                    Habitacion disponible
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Los viajeros podran reservar esta habitacion
                  </p>
                </div>
                <Switch
                  id="isEnabled"
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
              </div>
            )}
          </form.Field>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-24">
              {isPending ? (
                <LoadingSpinner size="sm" className="text-primary-foreground" />
              ) : isEditing ? (
                'Guardar cambios'
              ) : (
                'Crear habitacion'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
