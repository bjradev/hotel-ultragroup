import { Badge } from '@/shared/components/ui/badge'

export function RoomStatusBadge({ isEnabled }: { isEnabled: boolean }) {
  return (
    <Badge
      className={
        isEnabled
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50'
          : 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-100'
      }
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${
          isEnabled ? 'bg-emerald-500' : 'bg-zinc-400'
        }`}
      />
      {isEnabled ? 'Disponible' : 'No disponible'}
    </Badge>
  )
}
