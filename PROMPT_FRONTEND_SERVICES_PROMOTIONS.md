# Prompt para Agente IA — Frontend: Services & Promotions

## Contexto del proyecto

Estás trabajando en **Gestor Bancario**, una SPA en React + Vite + Tailwind CSS v4. El proyecto ya tiene implementados los módulos de Auth, Cuentas, Transacciones y Favoritos. Debes implementar el frontend para **Services** (Servicios) y **Promotions** (Promociones), siguiendo exactamente las convenciones existentes.

---

## Stack y convenciones obligatorias

- React 19 + Vite + Tailwind CSS v4
- Zustand-like store vía Context (patrón del proyecto: `AuthContext`)
- `react-router-dom` v7 para rutas
- `react-hot-toast` para notificaciones
- `axios` ya configurado en `src/shared/api/api.js` (instancias `axiosAccount` y `axiosTransaction`)
- `lucide-react` para íconos

**Paleta y tema del proyecto:**
- Fondo oscuro: `#0a0a0a`, `#111111`, `#1a1a1a`
- Bordes: `border-white/[0.07]` o `border-white/[0.14]`
- Texto: `text-white`, `text-white/40`, `text-white/70`
- Acento admin: azul `#1a56db`, `#011743`
- Cards con `rounded-[16px]` y `bg-[#111111]`
- Botones primarios: `bg-white text-black` (cliente) o `bg-[#1a56db] text-white` (admin)

---

## Estructura de archivos a crear

```
src/
├── features/
│   ├── services/
│   │   ├── components/
│   │   │   ├── ServiceCard.jsx          # Tarjeta de servicio (usuario)
│   │   │   ├── ServiceList.jsx          # Listado con filtros + paginación
│   │   │   ├── ServiceDetailModal.jsx   # Modal detalle de servicio
│   │   │   ├── ServiceFormModal.jsx     # Modal crear/editar (solo Admin)
│   │   │   └── ServiceFilters.jsx       # Filtros: tipo, categoría, precio, búsqueda
│   │   ├── pages/
│   │   │   ├── ClientServicesPage.jsx   # Vista cliente: solo ACTIVE
│   │   │   └── AdminServicesPage.jsx    # Vista admin: CRUD completo
│   │   └── hooks/
│   │       └── useServices.js           # Lógica de fetch, filtros, paginación
│   └── promotions/
│       ├── components/
│       │   ├── PromotionCard.jsx         # Tarjeta de promoción
│       │   ├── PromotionList.jsx         # Listado con filtros + paginación
│       │   ├── PromotionDetailModal.jsx  # Modal detalle
│       │   ├── PromotionFormModal.jsx    # Modal crear/editar (solo Admin)
│       │   ├── PromotionToggleModal.jsx  # Modal para ACTIVATE/PAUSE/CANCEL
│       │   ├── PromotionStatsModal.jsx   # Modal stats (solo Admin)
│       │   └── PromotionFilters.jsx      # Filtros: tipo, status, segmento
│       ├── pages/
│       │   ├── ClientPromotionsPage.jsx  # Vista cliente: solo ACTIVE
│       │   └── AdminPromotionsPage.jsx   # Vista admin: CRUD + toggle + stats
│       └── hooks/
│           └── usePromotions.js          # Lógica de fetch, filtros, paginación
└── shared/
    └── api/
        ├── services.js    # Todas las llamadas a /services
        └── promotions.js  # Todas las llamadas a /promotions
```

---

## Capa API — `src/shared/api/services.js`

Usa `axiosAccount` importado de `./api`. Base URL ya apunta a `http://localhost:3006/gestionBancaria/api/v1`.

```js
import { axiosAccount, requestFormData, API_CONFIG } from './api'

// Listar servicios (filtros por query string)
export const getServices = (params = {}) =>
  axiosAccount.get('/services', { params })

// Obtener un servicio por ID
export const getServiceById = (id) =>
  axiosAccount.get(`/services/${id}`)

// Crear servicio — multipart/form-data
export const createService = (formData) =>
  requestFormData(`${API_CONFIG.bankBaseUrl}/services`, {
    method: 'POST',
    body: formData,
  })

// Actualizar servicio — multipart/form-data
export const updateService = (id, formData) =>
  requestFormData(`${API_CONFIG.bankBaseUrl}/services/${id}`, {
    method: 'PUT',
    body: formData,
  })

// Soft delete (ARCHIVED)
export const deleteService = (id) =>
  axiosAccount.delete(`/services/${id}`)
```

> Los campos `tags`, `targetRoles` y `discount` deben enviarse como **strings JSON** en el FormData (el backend los parsea con `parse-json-fields`).

---

## Capa API — `src/shared/api/promotions.js`

```js
import { axiosAccount, requestFormData, requestJson, API_CONFIG } from './api'

export const getPromotions = (params = {}) =>
  axiosAccount.get('/promotions', { params })

export const getPromotionById = (id) =>
  axiosAccount.get(`/promotions/${id}`)

export const createPromotion = (formData) =>
  requestFormData(`${API_CONFIG.bankBaseUrl}/promotions`, {
    method: 'POST',
    body: formData,
  })

export const updatePromotion = (id, formData) =>
  requestFormData(`${API_CONFIG.bankBaseUrl}/promotions/${id}`, {
    method: 'PUT',
    body: formData,
  })

export const deletePromotion = (id) =>
  axiosAccount.delete(`/promotions/${id}`)

// PATCH /promotions/:id/toggle — body JSON: { action, reason? }
export const togglePromotion = (id, body) =>
  axiosAccount.patch(`/promotions/${id}/toggle`, body)

// GET /promotions/:id/stats (solo Admin)
export const getPromotionStats = (id) =>
  axiosAccount.get(`/promotions/${id}/stats`)
```

---

## Hooks personalizados

### `useServices.js`

```js
import { useState, useEffect, useCallback } from 'react'
import { getServices } from '../../../shared/api/services'
import toast from 'react-hot-toast'

export const useServices = (initialFilters = {}) => {
  const [services, setServices] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ page: 1, limit: 10, ...initialFilters })

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getServices(filters)
      setServices(res.data.data)
      setPagination(res.data.pagination)
    } catch {
      toast.error('Error al cargar servicios')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetch() }, [fetch])

  return { services, pagination, loading, filters, setFilters, refetch: fetch }
}
```

Crea `usePromotions.js` con el mismo patrón, usando `getPromotions`.

---

## Componentes clave

### `ServiceCard.jsx`

Props: `service`, `isAdmin`, `onEdit`, `onDelete`, `onView`

Muestra: nombre, categoría, precio + moneda, badge de status, imagen si tiene. Para admin muestra botones Editar / Archivar. Para cliente muestra botón Ver detalle.

Badge de status con colores:
- `ACTIVE` → verde
- `DRAFT` → gris
- `INACTIVE` → amarillo
- `ARCHIVED` → rojo

### `ServiceFormModal.jsx`

Modal que sirve tanto para Crear como para Editar. Recibe `service` (null = crear, objeto = editar), `onClose`, `onSuccess`.

Campos del formulario:
- `name` (text, required)
- `description` (textarea, required)
- `type` (select: PRODUCT / SERVICE, required)
- `price` (number, required)
- `currency` (select: GTQ / USD / EUR / MXN)
- `category` (text)
- `status` (select: DRAFT / ACTIVE / INACTIVE)
- `active` (checkbox)
- `validFrom` / `validTo` (date)
- `minBalance` (number)
- `requiresVerifiedEmail` (checkbox)
- `maxUsesPerUser` / `totalUsesLimit` (number)
- `targetRoles` (multi-checkbox: USER_ROLE / EMPLOYEE_ROLE)
- `tags` (input tipo chips: separados por coma, se envía como JSON string `["tag1","tag2"]`)
- `discount` (sección colapsable con campos: type, value, startAt, endAt — se envía como JSON string)
- `image` (file input, opcional)
- `terms` (textarea, requerido si type === SERVICE)
- `internalNote` (textarea)

Al enviar, construye un `FormData` y pasa los arrays/objetos como `JSON.stringify(value)`.

### `PromotionToggleModal.jsx`

Modal pequeño que recibe `promotion`, `onClose`, `onSuccess`. Muestra radio buttons para seleccionar acción (ACTIVATE / PAUSE / CANCEL). Si se selecciona CANCEL, aparece campo `reason` (requerido). Llama a `togglePromotion(id, { action, reason })`.

### `PromotionStatsModal.jsx`

Muestra stats en cards pequeñas: totalUses, uniqueUsers, budgetUsed, remainingBudget, daysRemaining, usesRemaining. Llama a `getPromotionStats(id)` al montar.

---

## Páginas

### `AdminServicesPage.jsx`

- Header con título + botón "Nuevo servicio" (abre `ServiceFormModal` en modo crear)
- `ServiceFilters` con inputs para `q`, `type`, `status`, `category`, rango de precio, `sortBy`
- `ServiceList` con `ServiceCard` por cada item
- Paginación (botones Anterior / Siguiente)
- Al hacer clic en Editar → abre `ServiceFormModal` con el servicio seleccionado
- Al hacer clic en Archivar → modal de confirmación simple, luego `deleteService`

### `ClientServicesPage.jsx`

- Filters simplificados (solo `q`, `type`, `category`)
- Lista de `ServiceCard` sin opciones de edición
- Al hacer clic en una card → abre `ServiceDetailModal`

### `AdminPromotionsPage.jsx`

- Header con título + botón "Nueva promoción"
- Filtros: `q`, `status`, `type`, `targetSegment`
- `PromotionCard` con botones: Editar, Toggle (abre `PromotionToggleModal`), Stats (abre `PromotionStatsModal`), Cancelar
- Paginación

### `ClientPromotionsPage.jsx`

- Solo muestra promociones ACTIVE visibles para el usuario
- Cards con nombre, descripción, tipo, fechas de vigencia

---

## Rutas — cambios en `AppRoutes.jsx`

Agrega dentro del bloque Admin:
```jsx
import { AdminServicesPage } from '../../features/services/pages/AdminServicesPage'
import { AdminPromotionsPage } from '../../features/promotions/pages/AdminPromotionsPage'

// dentro de <Route path="/dashboard" ...>
<Route path="servicios" element={<AdminServicesPage />} />
<Route path="promociones" element={<AdminPromotionsPage />} />
```

Agrega dentro del bloque Cliente:
```jsx
import { ClientServicesPage } from '../../features/services/pages/ClientServicesPage'
import { ClientPromotionsPage } from '../../features/promotions/pages/ClientPromotionsPage'

// dentro de <Route path="/client" ...>
<Route path="servicios" element={<ClientServicesPage />} />
<Route path="promociones" element={<ClientPromotionsPage />} />
```

Agrega los links de navegación en `Navbar.jsx` (admin) y `ClientNavbar.jsx` (cliente) usando los íconos `Package` y `Tag` de lucide-react.

---

## Patrón de modal reutilizable

Todos los modales deben seguir este patrón de estructura:

```jsx
// Modal wrapper (puedes crear un componente Modal.jsx en shared/components/ui/)
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
  <div className="relative w-full max-w-lg rounded-[20px] border border-white/[0.1] bg-[#111111] p-6 shadow-2xl">
    {/* Header */}
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
    </div>
    {/* Content */}
    {children}
  </div>
</div>
```

Crea `src/shared/components/ui/Modal.jsx` como wrapper genérico que reciba `title`, `onClose` y `children`.

---

## Notas importantes

1. **Roles:** Usa `session.user.role` del `useAuthStore` para diferenciar Admin de Cliente. Admins ven todos los estados; clientes solo ven `ACTIVE + active: true`.

2. **FormData con arrays/objetos:** Siempre convierte a JSON string:
   ```js
   formData.append('tags', JSON.stringify(['tag1', 'tag2']))
   formData.append('discount', JSON.stringify({ type: 'PERCENT', value: 10 }))
   ```

3. **Manejo de errores de axios:** Los interceptores ya están configurados. Captura con `try/catch` y muestra `toast.error(error.response?.data?.message || 'Error')`.

4. **Paginación:** El backend devuelve `{ data, pagination: { currentPage, totalPages, totalRecords, limit } }`. Maneja el estado `page` en el hook y pasa `setFilters(prev => ({ ...prev, page: newPage }))`.

5. **Imágenes:** El campo de imagen es opcional. Si el usuario sube una, agrégala al FormData como `formData.append('image', file)`. Si no, no incluyas el campo.

6. **Consistencia visual:** Sigue el tema oscuro del resto del proyecto (`#0a0a0a`, `#111111`, bordes `white/[0.07]`). Los badges de status deben ser pequeños, con `rounded-full` y colores semánticos.
