import { useForm } from '@tanstack/react-form'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
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
import type { Hotel } from '@/core/domain/hotel'

type HotelFormValues = {
  name: string
  description: string
  city: string
  address: string
  stars: number
  isEnabled: boolean
}

type HotelFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  hotel?: Hotel | null
  onSubmit: (values: HotelFormValues) => Promise<void>
  isPending: boolean
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive mt-1">{message}</p>
}

export function HotelForm({ open, onOpenChange, hotel, onSubmit, isPending }: HotelFormProps) {
  const isEditing = Boolean(hotel)

  const form = useForm({
    defaultValues: {
      name: hotel?.name ?? '',
      description: hotel?.description ?? '',
      city: hotel?.city ?? '',
      address: hotel?.address ?? '',
      stars: hotel?.stars ?? 3,
      isEnabled: hotel?.isEnabled ?? true,
    } satisfies HotelFormValues,
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
          <SheetTitle>{isEditing ? 'Editar hotel' : 'Nuevo hotel'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos del hotel. Los cambios se guardan al confirmar.'
              : 'Completa los datos para registrar un nuevo hotel en el sistema.'}
          </SheetDescription>
        </SheetHeader>

        <form
          className="flex flex-col gap-5 flex-1 px-6 py-5"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          {/* Nombre */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value.trim()
                  ? 'El nombre del hotel es requerido'
                  : value.trim().length < 3
                    ? 'El nombre debe tener al menos 3 caracteres'
                    : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="name">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Hotel El Dorado"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <FieldError message={field.state.meta.errors[0] as string | undefined} />
              </div>
            )}
          </form.Field>

          {/* Ciudad y Estrellas en fila */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="city"
              validators={{
                onChange: ({ value }) =>
                  !value.trim() ? 'La ciudad es requerida' : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="city">
                    Ciudad <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="Bogota"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                  <FieldError message={field.state.meta.errors[0] as string | undefined} />
                </div>
              )}
            </form.Field>

            <form.Field name="stars">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="stars">Categoria</Label>
                  <Select
                    value={String(field.state.value)}
                    onValueChange={(v) => field.handleChange(Number(v))}
                  >
                    <SelectTrigger id="stars">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {'★'.repeat(n)} {n} {n === 1 ? 'estrella' : 'estrellas'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          {/* Direccion */}
          <form.Field
            name="address"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? 'La direccion es requerida' : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="address">
                  Direccion <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  placeholder="Cra. 10 #25-45, Centro"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <FieldError message={field.state.meta.errors[0] as string | undefined} />
              </div>
            )}
          </form.Field>

          {/* Descripcion */}
          <form.Field name="description">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="description">
                  Descripcion{' '}
                  <span className="text-muted-foreground text-xs font-normal">(opcional)</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe el hotel, sus servicios y caracteristicas..."
                  rows={3}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="resize-none"
                />
              </div>
            )}
          </form.Field>

          {/* Estado */}
          <form.Field name="isEnabled">
            {(field) => (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isEnabled" className="cursor-pointer">
                    Hotel habilitado
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Los viajeros podran encontrar y reservar este hotel
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
                'Crear hotel'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
