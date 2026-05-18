# Documentación — Services & Promotions (Gestor Bancario)

## Arquitectura General del Proyecto

El sistema de gestión bancaria se compone de **dos backends** y un **frontend**:

```
┌─────────────────────┐     ┌─────────────────────────┐     ┌──────────────┐
│   React + Vite      │────▶│  Gestor Bancario (:3006) │────▶│  MongoDB     │
│   (Frontend)        │     │  Express + Mongoose      │     │              │
│                     │────▶│                           │     └──────────────┘
└─────────────────────┘     │  - Cuentas                │
                            │  - Transacciones          │
                            │  - Favoritos              │
                            │  - Services       ★ NUEVO │
                            │  - Promotions     ★ NUEVO │
                            │  - Cron Job       ★ NUEVO │
                            └────────┬──────────────────┘
                                     │ HTTP (verificaciones)
                            ┌────────▼──────────────────┐
                            │  AuthService (:4000)       │
                            │  Express + PostgreSQL      │
                            │  - Autenticación / JWT     │
                            │  - Roles / Perfiles        │
                            └────────────────────────────┘
```

Los JWT son **compartidos** entre ambos backends (misma `JWT_SECRET`, `issuer`, `audience`). El token incluye `sub` (userId) y `role` en el payload.

---

## Estructura de Archivos (lo nuevo)

```
Gestor_Bancario_Backend/
├── helpers/
│   └── promotion-status-cron.js      ★ Cron job de mantenimiento
├── middlewares/
│   ├── allowed-fields.js             ★ Constantes de campos permitidos
│   ├── checkPromotionEligibility.js  ★ Verificación de elegibilidad (promos)
│   ├── checkServiceEligibility.js    ★ Verificación de elegibilidad (services)
│   ├── promotion-validators.js       ★ Ampliado (3 validators nuevos)
│   ├── service-validators.js         ★ Nuevo (4 validators)
│   └── ... (existentes)
├── src/
│   ├── promotions/
│   │   ├── promotion.model.js        ★ Ampliado (+13 campos)
│   │   ├── promotion.controller.js   ★ Reescrito (+2 endpoints)
│   │   ├── promotion.routes.js       ★ Actualizado
│   │   └── promotion-usage.model.js  ★ Nuevo modelo
│   └── services/
│       ├── service.model.js          ★ Ampliado (+12 campos)
│       ├── service.controller.js     ★ Reescrito
│       └── service.routes.js         ★ Actualizado
└── index.js                          ★ Modificado (cron)
```

---

## Flujo Completo: Services

### Ciclo de vida de un Servicio

```
DRAFT ──▶ ACTIVE ──▶ INACTIVE
  │                      │
  └──────────────────────┴──▶ ARCHIVED (soft delete)
```

### Endpoints

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `POST` | `/services` | Admin | Crear servicio (status: DRAFT por defecto) |
| `GET` | `/services` | Todos | Listar con filtros, paginación y sorting |
| `GET` | `/services/:id` | Todos | Detalle (con eligibility check para no-admins) |
| `PUT` | `/services/:id` | Admin | Actualizar (agrega `updatedBy`) |
| `DELETE` | `/services/:id` | Admin | Soft delete → status: ARCHIVED |

### Crear un Servicio (Admin)

El admin envía un POST con los campos del servicio. El sistema:
1. Valida todos los campos con `validateCreateService` (express-validator)
2. Agrega `createdBy: req.userId` automáticamente
3. Si no viene `status`, default a `DRAFT`
4. Si viene `discount`, valida que el valor sea coherente con el precio
5. Devuelve `201` con el servicio creado

### Listar Servicios

**Si eres usuario normal:** Solo ves servicios con `status: ACTIVE` y `active: true`. El campo `internalNote` se oculta.

**Si eres admin:** Ves todos los estados. Puedes filtrar por `status`, `type`, `category`, `currency`, rango de precio, `targetRole`, y buscar por texto (`q`).

Paginación incluida en la respuesta:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 48,
    "limit": 10
  }
}
```

### Consultar un Servicio (Usuario)

Cuando un usuario (no admin) pide `GET /services/:id`, el middleware `checkServiceEligibility` verifica **en orden**:

1. ¿Existe y está `ACTIVE` + `active: true`?
2. ¿El rol del usuario está en `targetRoles`?
3. ¿La fecha actual es >= `validFrom`?
4. ¿La fecha actual es <= `validTo`?
5. ¿No se superó `totalUsesLimit`?
6. ¿El usuario tiene email verificado? (llama al AuthService)
7. ¿El usuario tiene saldo suficiente? (consulta cuentas en MongoDB)

Si cualquier verificación falla → respuesta clara con código HTTP apropiado.
Si el AuthService no responde al verificar email → `503`.
Si falla la consulta de saldo → graceful degradation (continúa).

### Soft Delete

`DELETE /services/:id` NO elimina el servicio. Cambia `status` a `ARCHIVED` y `active` a `false`. Si ya está archivado, devuelve `409`.

### Actualizar con invalidación de descuento

Si actualizas el `price` y el servicio tiene un descuento tipo `AMOUNT` cuyo valor supera el nuevo precio, el descuento se invalida automáticamente (se pone `null`) y se notifica en la respuesta con un `warning`.

---

## Flujo Completo: Promotions

### Ciclo de vida de una Promoción

```
DRAFT ──▶ SCHEDULED ──▶ ACTIVE ──▶ EXPIRED
  │           │            │
  │           │            └──▶ PAUSED ──▶ ACTIVE (re-activar)
  │           │
  └───────────┴────────────────▶ CANCELLED (soft delete o toggle)
```

Las transiciones automáticas las maneja el **cron job**:
- `SCHEDULED` → `ACTIVE` cuando llega `validFrom`
- `ACTIVE` → `EXPIRED` cuando pasa `validTo`

### Endpoints

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `POST` | `/promotions` | Admin | Crear promoción |
| `GET` | `/promotions` | Todos | Listar con filtros y paginación |
| `GET` | `/promotions/:id` | Todos | Detalle (con eligibility check) |
| `PUT` | `/promotions/:id` | Admin | Actualizar |
| `DELETE` | `/promotions/:id` | Admin | Soft delete → CANCELLED |
| `PATCH` | `/promotions/:id/toggle` | Admin | Activar / Pausar / Cancelar |
| `GET` | `/promotions/:id/stats` | Admin | Estadísticas de uso |

### Crear una Promoción (Admin)

1. Validación completa de todos los campos
2. Si viene `applicableServices`, verifica que cada ID exista en la colección Service
3. Si `validFrom` está en el futuro y se intenta activar → status = `SCHEDULED`
4. Agrega `createdBy: req.userId`

### Toggle de Estado (PATCH /toggle)

El admin puede cambiar el estado con una sola acción:

| Acción | Desde | Hacia | Requiere |
|--------|-------|-------|----------|
| `ACTIVATE` | DRAFT, PAUSED | ACTIVE | Que `validTo` no haya pasado |
| `PAUSE` | ACTIVE | PAUSED | — |
| `CANCEL` | Cualquiera excepto EXPIRED | CANCELLED | `reason` obligatorio |

### Elegibilidad de Promoción (Usuario)

Cuando un usuario pide `GET /promotions/:id`, se verifica:

1. ¿Existe, ACTIVE y active?
2. ¿Fecha actual entre validFrom y validTo?
3. ¿Rol del usuario en targetRoles?
4. ¿No se superó maxUsesGlobal?
5. ¿No se agotó el budget?
6. **Segmento del usuario** (si `targetSegment !== 'ALL'`):
   - `NEW` → usuario creado hace < 30 días (consulta AuthService)
   - `VIP` → tiene cuenta con saldo >= Q10,000 (consulta MongoDB)
   - `INACTIVE` → sin transacciones en 60 días
   - `PREMIUM` → más de una cuenta activa
7. ¿No tiene otra promo non-stackable activa?
8. ¿No superó maxUsesPerUser?

### Estadísticas (GET /stats)

Solo admin. Devuelve:
```json
{
  "totalUses": 234,
  "uniqueUsers": 180,
  "budgetUsed": 12500,
  "remainingBudget": 37500,
  "daysRemaining": 15,
  "usesRemaining": 766
}
```

---

## Manejo de Imágenes (multipart/form-data)

Tanto la creación como la actualización de **Servicios** y **Promociones** soportan la carga de imágenes usando **Cloudinary** a través de `multipart/form-data`.

Los endpoints afectados son:
- `POST /services`
- `PUT /services/:id`
- `POST /promotions`
- `PUT /promotions/:id`

### Reglas de Petición

1. El cuerpo de la petición debe ser de tipo `multipart/form-data`.
2. La imagen física debe enviarse en el campo `image` (tipo archivo). Si se sube con éxito, el sistema autocompleta el campo `imageUrl`.
3. Los arreglos (`tags`, `targetRoles`, `applicableServices`) y los objetos (`discount`, `conditions`) deben enviarse como **strings JSON válidos**. El middleware interno `parse-json-fields.js` se encarga de parsearlos automáticamente de string a objeto o arreglo en el servidor antes de las validaciones.

Ejemplo (cURL):
```bash
curl -X POST http://localhost:3006/gestionBancaria/api/v1/services \
  -H "Authorization: Bearer <token>" \
  -F "name=Servicio premium" \
  -F "type=SERVICE" \
  -F "price=150" \
  -F "tags=[\"vip\",\"promo\"]" \
  -F "image=@/ruta/imagen.jpg"
```

---

## PromotionUsage (Modelo de rastreo)

Cada vez que un usuario "usa" una promoción, se crea un registro:

```json
{
  "promotionId": "ObjectId",
  "userId": "uuid-del-auth-service",
  "accountNumber": "1234567890",
  "usedAt": "2026-06-15T10:30:00Z",
  "status": "APPLIED",
  "benefitDetails": { "cashback": 50 }
}
```

Este modelo permite:
- Contar usos globales y por usuario
- Detectar conflictos de stackability
- Generar estadísticas

---

## Cron Job de Mantenimiento

Ubicado en `helpers/promotion-status-cron.js`. Se ejecuta cada **15 minutos** usando `setInterval` (sin dependencias externas). Se inicia en `index.js` después de la conexión a MongoDB.

Hace 3 cosas:
1. Promociones `SCHEDULED` cuyo `validFrom` ya llegó → `ACTIVE`
2. Promociones `ACTIVE` cuyo `validTo` ya pasó → `EXPIRED`
3. Servicios `ACTIVE` cuyo `validTo` ya pasó → `INACTIVE`

Cada cambio se loguea con timestamp en consola.

---

## Validaciones (Middlewares)

### service-validators.js
- `validateCreateService` — Validación completa de todos los campos al crear
- `validateUpdateService` — Igual pero todo opcional, con whitelist de campos
- `validateServiceId` — Valida que el param `:id` sea un MongoId válido
- `validateServiceQuery` — Valida query params del listado (paginación, sorting, filtros)

### promotion-validators.js (ampliado)
- `validateCreatePromotion` — Ya existía, ahora incluye los campos nuevos
- `validateUpdatePromotion` — Igual, ampliado
- `validatePromotionId` — Sin cambios
- `validatePromotionQuery` — **NUEVO**: query params del listado
- `validateTogglePromotion` — **NUEVO**: valida `action` y `reason`
- `validateApplyPromotion` — **NUEVO**: valida `promotionId` y `accountNumber`

### allowed-fields.js
Arrays centralizados de campos permitidos para las whitelists de update.

---

## Convenciones de Respuesta

**Éxito:**
```json
{ "success": true, "message": "...", "data": {...} }
```

**Error:**
```json
{ "success": false, "message": "...", "errors": [...] }
```

**Paginación:**
```json
{ "success": true, "data": [...], "pagination": { "currentPage": 1, "totalPages": 5, "totalRecords": 48, "limit": 10 } }
```

---

## Variables de Entorno Relevantes

| Variable | Default | Uso |
|----------|---------|-----|
| `AUTH_SERVICE_URL` | `http://localhost:4000/api/v1` | URL del AuthService para verificaciones de elegibilidad |
| `JWT_SECRET` | — | Clave compartida entre ambos backends |
| `PORT` | `3006` | Puerto del Gestor Bancario |
