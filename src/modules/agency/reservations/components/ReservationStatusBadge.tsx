import { Badge } from '@/shared/components/ui/badge'
import type { ReservationStatus } from '@/core/domain/reservation'

const STATUS_CONFIG: Record<
  ReservationStatus,
  { label: string; className: string; dotClass: string }
> = {
  pending: {
    label: 'Pendiente',
    className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50',
    dotClass: 'bg-amber-500',
  },
  confirmed: {
    label: 'Confirmada',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
    dotClass: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelada',
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50',
    dotClass: 'bg-red-500',
  },
  completed: {
    label: 'Completada',
    className: 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-100',
    dotClass: 'bg-zinc-400',
  },
}

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge className={config.className}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${config.dotClass}`} />
      {config.label}
    </Badge>
  )
}
