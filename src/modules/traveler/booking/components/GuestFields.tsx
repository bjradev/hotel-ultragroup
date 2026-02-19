import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import type { Gender, DocumentType } from '@/core/domain/reservation'

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive mt-1">{message}</p>
}

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  )
}

type TextFieldProps = {
  id: string
  label: string
  placeholder: string
  type?: string
  colSpan?: boolean
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
}

export function TextField({
  id,
  label,
  placeholder,
  type = 'text',
  colSpan,
  value,
  onChange,
  onBlur,
  error,
}: TextFieldProps) {
  return (
    <div className={colSpan ? 'sm:col-span-2' : undefined}>
      <div className="space-y-1.5">
        <Label htmlFor={id}>
          {label} <span className="text-destructive">*</span>
        </Label>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
        <FieldError message={error} />
      </div>
    </div>
  )
}

type DateFieldProps = {
  id: string
  label: string
  max?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
}

export function DateField({ id, label, max, value, onChange, onBlur, error }: DateFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label} <span className="text-destructive">*</span>
      </Label>
      <Input
        id={id}
        type="date"
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      <FieldError message={error} />
    </div>
  )
}

type SelectFieldProps = {
  label: string
  placeholder: string
  options: { value: string; label: string }[]
  value: string
  onValueChange: (value: string) => void
  error?: string
}

export function SelectField({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  error,
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label} <span className="text-destructive">*</span>
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError message={error} />
    </div>
  )
}

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' },
]

export const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: 'cc', label: 'Cédula de ciudadanía' },
  { value: 'passport', label: 'Pasaporte' },
  { value: 'ce', label: 'Cédula de extranjería' },
  { value: 'nit', label: 'NIT' },
]
