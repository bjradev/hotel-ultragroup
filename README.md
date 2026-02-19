# Hotel UltraGroup

Sistema de gestión y reserva de hoteles con dos módulos: **Administración** (perfil agencia) y **Reservas** (perfil viajero).

**[Demo en vivo](https://hotel-ultragroup.vercel.app)**

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19, TypeScript 5.9, Tailwind CSS 4, shadcn/ui (Radix) |
| Routing | React Router 7 (lazy loading + Suspense) |
| Estado servidor | TanStack React Query 5 |
| Estado cliente | Zustand 5 (persistido en localStorage) |
| Formularios | TanStack React Form 1 |
| Backend | Supabase (PostgreSQL + Auth + REST) |
| Build | Vite 7, SWC |
| Testing | Vitest 4, Testing Library |
| Deploy | Vercel |

## Ejecución local

```bash
# 1. Clonar e instalar
git clone https://github.com/bjradev/hotel-ultragroup.git
cd hotel-ultragroup
bun install        # o npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de Supabase

# 3. Levantar
bun run dev        # http://localhost:5173

# 4. Tests
bun run test:run
```

### Scripts disponibles

| Script | Descripción |
|---|---|
| `dev` | Servidor de desarrollo |
| `build` | Build de producción (tsc + vite) |
| `lint` | ESLint |
| `test` | Tests en modo watch |
| `test:run` | Tests en modo CI |
| `preview` | Previsualizar build |

## Arquitectura

```
src/
├── core/                          # Capa de negocio (sin dependencias de UI)
│   ├── domain/                    # Entidades, interfaces, errores
│   │   ├── hotel/                 # Hotel, HotelRepository
│   │   ├── room/                  # Room, RoomRepository
│   │   ├── reservation/           # Reservation, Guest, ReservationRepository
│   │   └── shared/                # EntityId, DomainError, ValidationError
│   └── application/               # Casos de uso (1 clase = 1 acción)
│       ├── hotel/                 # CRUD + búsqueda por ciudad
│       ├── room/                  # CRUD + disponibilidad
│       ├── reservation/           # Crear, listar, detalle
│       └── services.ts            # Composición de dependencias
│
├── infrastructure/                # Implementaciones concretas
│   └── supabase/
│       ├── client.ts              # Cliente Supabase
│       ├── mappers.ts             # snake_case ↔ camelCase
│       └── repositories/          # Implementación de interfaces del dominio
│
├── modules/                       # Features por perfil de usuario
│   ├── traveler/                  # Búsqueda → Detalle → Reserva → Confirmación
│   │   ├── search/
│   │   ├── hotel-detail/
│   │   └── booking/
│   └── agency/                    # Gestión de hoteles, habitaciones, reservas
│       ├── hotels/
│       ├── rooms/
│       └── reservations/
│
├── shared/                        # Código transversal
│   ├── components/ui/             # shadcn/ui
│   ├── components/common/         # PageHeader, EmptyState, LoadingSpinner
│   ├── components/layout/         # TravelerLayout, AgencyLayout
│   └── lib/                       # formatters, utils
│
├── store/                         # Zustand (booking store persistido)
└── router/                        # Rutas con lazy loading
```

## Decisiones técnicas

### Clean Architecture

Se adoptó separación en capas **Domain → Application → Infrastructure → Presentation**:

- **Domain** define entidades (`Hotel`, `Room`, `Reservation`, `Guest`) e interfaces de repositorio puras, sin dependencia de framework ni BD.
- **Application** contiene use cases con una sola responsabilidad (`CreateReservationUseCase`, `SearchHotelsByCityUseCase`, etc.), validaciones de negocio y manejo de errores tipados (`ValidationError`, `ConflictError`, `NotFoundError`).
- **Infrastructure** implementa los repositorios contra Supabase con mappers explícitos entre formatos DB (snake_case) y dominio (camelCase).
- **Presentation** consume use cases inyectados vía `services.ts`, desacoplada del backend.

**Por qué**: Permite reemplazar Supabase por otra fuente de datos sin tocar lógica de negocio ni componentes. Los use cases son testeables con mocks simples (sin necesidad de BD real).

### Manejo de estado

- **TanStack React Query** para estado del servidor: caché automático, invalidación tras mutaciones, estados de carga/error declarativos.
- **Zustand** para estado del cliente: datos de búsqueda y booking persistidos en localStorage con deserialización segura de `Date`.
- **TanStack React Form** para formularios con validación `onChange` y render-props tipadas.

**Por qué**: Cada herramienta resuelve un dominio específico. No se mezcla estado del servidor con estado local. React Query elimina la necesidad de `useEffect` para data fetching.

### Componentes reutilizables desacoplados

Los componentes de formulario (`TextField`, `DateField`, `SelectField`) en `GuestFields.tsx` reciben `value`/`onChange`/`onBlur`/`error` como props primitivas, sin depender de `@tanstack/react-form`. Esto permite reutilizarlos con cualquier librería de formularios.

### Disponibilidad de habitaciones

La lógica de disponibilidad usa **detección de solapamiento temporal**: una habitación está ocupada si existe alguna reserva no cancelada donde `check_in < nuevoCheckOut AND check_out > nuevoCheckIn`. Se implementa tanto en `RoomRepository.findAvailableByHotel` (listado) como en `ReservationRepository.isRoomAvailable` (validación antes de crear).

## Escalabilidad

| Aspecto | Estado actual | Evolución |
|---|---|---|
| **Autenticación** | No implementada | Supabase Auth + RLS por rol (agencia/viajero) |
| **Paginación** | Tipos definidos (`PaginatedResult`) | Cursor-based pagination en repositorios + React Query `useInfiniteQuery` |
| **Imágenes** | No implementadas | Supabase Storage + CDN para fotos de hoteles/habitaciones |
| **i18n** | Hardcodeado en español | `react-intl` o `i18next` con los textos ya centralizados en constantes |
| **Notificaciones** | Toast local (Sonner) | Email de confirmación vía Supabase Edge Functions |
| **CI/CD** | Deploy automático en Vercel | GitHub Actions: lint + test + build gate en PR |
| **Monitoreo** | No implementado | Sentry para errores, Vercel Analytics para performance |

## Testing

Los tests del dominio usan **mocks de repositorio** inyectados vía constructor (inversión de dependencias), sin necesidad de conexión a BD:

```bash
bun run test:run

# ✓ CreateReservationUseCase (4 tests)
#   ✓ crea reserva con datos válidos
#   ✓ rechaza check-out anterior a check-in (ValidationError)
#   ✓ rechaza habitación no disponible (ConflictError)
#   ✓ rechaza email inválido (ValidationError)
```

## Base de datos

El proyecto usa Supabase (PostgreSQL). Las tablas esperadas son:

- **hotels** — `id`, `name`, `description`, `city`, `address`, `stars`, `is_enabled`, timestamps
- **rooms** — `id`, `hotel_id` (FK), `type`, `base_cost`, `taxes`, `location`, `capacity`, `is_enabled`, timestamps
- **reservations** — `id`, `hotel_id` (FK), `room_id` (FK), `guest` (jsonb), `emergency_contact` (jsonb), `check_in`, `check_out`, `total_cost`, `status`, timestamps
