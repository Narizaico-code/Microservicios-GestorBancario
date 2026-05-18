# Prompt para Agente IA — Gestor Bancario (MongoDB Seed + Placeholders)

---

## Contexto del proyecto

Eres un agente experto en desarrollo fullstack trabajando sobre un proyecto llamado **Gestor Bancario**. El proyecto tiene un backend en Node.js/Express con MongoDB (Mongoose) y un frontend que consume dicha API. Tu trabajo tiene **dos objetivos principales** que debes completar en orden.

---

## OBJETIVO 1 — Generar archivos JSON de seed para MongoDB

### Instrucciones generales

1. Recorre **cada modelo de Mongoose** que encuentres dentro de `Gestor_Bancario_Backend/src/**/**.model.js`. Esos archivos son la fuente de verdad: contienen los campos, tipos, enums, valores por defecto, y restricciones (min, max, maxlength, required, unique, etc.).

2. Por cada modelo que encuentres, genera un archivo JSON independiente con el nombre `seed_<nombreColeccion>.json` dentro de una carpeta `Gestor_Bancario_Backend/seeds/`. Ejemplo: `seed_accounts.json`, `seed_transactions.json`, `seed_promotions.json`, etc.

3. Cada JSON debe ser un **array de al menos 8 objetos** con datos realistas en español (nombres guatemaltecos, montos en GTQ, descripciones bancarias coherentes). No uses datos genéricos como "test" o "lorem ipsum".

### Reglas obligatorias para los datos

- **Lee absolutamente todos los campos** del schema, incluyendo los opcionales. Rellena también los opcionales con datos de ejemplo para que las pruebas sean ricas y completas.
- Para campos con `enum`, distribuye los documentos entre **todos los valores posibles** del enum, no uses solo uno.
- Para campos `Date`, usa fechas ISO 8601 variadas: algunas en el pasado, algunas en el futuro, algunas cercanas a hoy. Esto es crítico para probar los cron jobs de status.
- Para campos con `unique: true` (como `name`, `numeroCuenta`), asegúrate de que ningún valor se repita dentro del mismo archivo.
- Para referencias entre colecciones (ej. `userId`, `promotionId`, `accountNumber`), usa los mismos valores de `_id` o identificadores que hayas generado en el seed de la colección referenciada. Deja comentarios `// referencia a seed_users.json` donde aplique.
- Para campos como `status` en Promotions, genera documentos en estados `DRAFT`, `SCHEDULED`, `ACTIVE`, `PAUSED`, `EXPIRED` y `CANCELLED` para cubrir todos los flujos.
- Para campos como `targetSegment` en Promotions, genera documentos para `ALL`, `VIP`, `NEW`, `INACTIVE` y `PREMIUM`.
- Para transacciones, genera ejemplos de los tres tipos: `DEPOSITO`, `TRANSFERENCIA` y `RETIRO`, con cuentas origen/destino que existan en el seed de cuentas.
- Respeta los límites: `monto` no puede ser <= 0, `saldo` no puede ser negativo, `price` mayor a 0, etc.

### Fuentes que DEBES consultar antes de generar cada JSON

Para cada entidad, antes de escribir una sola línea de JSON, abre y lee:
1. El archivo `*.model.js` correspondiente — define campos, tipos, enums, defaults y validaciones de Mongoose.
2. El archivo de validadores en `middlewares/` que corresponda (ej. `promotion-validators.js`, `service-validators.js`, `transaction.middleware.js`, `validateCreateAccount.js`) — pueden tener restricciones adicionales como longitudes máximas o formatos de string.
3. El archivo `middlewares/allowed-fields.js` — define qué campos son aceptados en updates; úsalo para asegurarte de no omitir ningún campo editable.
4. Los middlewares de elegibilidad (`checkPromotionEligibility.js`, `checkServiceEligibility.js`) — para entender condiciones de negocio que deben reflejarse en los datos de prueba (ej. necesitas cuentas con saldo >= 10000 para probar el segmento VIP).

### Casos de prueba especiales que DEBEN estar cubiertos en los seeds

- Al menos **una cuenta con saldo >= 10,000 GTQ** (para pruebas del segmento VIP de promociones).
- Al menos **un usuario con más de una cuenta activa** (para pruebas del segmento PREMIUM).
- Al menos **una cuenta con saldo 0** (para probar errores de saldo insuficiente).
- Al menos **una promoción non-stackable activa** (para probar el conflicto de stackability).
- Al menos **una promoción con `maxUsesGlobal` ya alcanzado** (para probar el límite global).
- Al menos **un servicio con `requiresVerifiedEmail: true`** y otro con `false`.
- Al menos **un servicio con `minBalance > 0`**.
- Transacciones que cubran el límite de Q2,000 por transferencia y el límite diario de Q10,000.
- Una solicitud de cuenta (`AccountRequest`) en cada estado: `PENDING`, `APPROVED`, `DENIED`.
- Al menos **un favorito** por usuario de prueba.

---

## OBJETIVO 2 — Agregar placeholders y labels descriptivos en el frontend y backend

### Por qué es necesario

Muchos campos del sistema tienen nombres técnicos (ej. `validFrom`, `stackable`, `targetSegment`, `minBalance`, `budgetUsed`, `monedaOrigen`) que un cliente o usuario final no comprende. Debes rastrear **todos los puntos donde se renderizan inputs, formularios o campos** y asegurarte de que cada uno tenga texto de ayuda claro.

### Instrucciones

1. Recorre **todo el frontend** buscando:
   - Elementos `<input>`, `<select>`, `<textarea>`, `<DatePicker>` o equivalentes de tu UI library.
   - Formularios de creación y edición de: Cuentas, Transacciones, Promociones, Servicios, Favoritos, Solicitudes de cuenta.

2. Para cada campo de input que encuentres:
   - Agrega o actualiza el atributo `placeholder` con texto descriptivo en **español** que explique qué debe ingresar el usuario. No uses el nombre técnico del campo como placeholder.
   - Agrega o actualiza el atributo `title` o un elemento `<label>` / `<FormLabel>` asociado con el nombre legible del campo.
   - Si el campo tiene restricciones (máximo de caracteres, formato, rango de valores), inclúyelas en el placeholder o en un texto de ayuda debajo del input.

3. **Para los campos más confusos**, agrega un tooltip o texto de ayuda `<small>` / helper text que aparezca debajo del input. Los campos que obligatoriamente necesitan esto son (búscalos por nombre en el código, no asumas su ubicación):
   - `validFrom` / `validTo` — explicar que definen el período activo.
   - `stackable` — explicar si la promoción se puede combinar con otras.
   - `targetSegment` — explicar qué significa cada segmento (VIP, NEW, INACTIVE, PREMIUM, ALL).
   - `targetRoles` — explicar a qué tipo de usuarios aplica.
   - `maxUsesGlobal` / `maxUsesPerUser` — diferenciar el límite total vs por usuario.
   - `budget` / `budgetUsed` — explicar que es el presupuesto máximo asignado.
   - `minBalance` — explicar que es el saldo mínimo requerido en la cuenta para acceder.
   - `requiresVerifiedEmail` — explicar qué implica para el usuario.
   - `conditions` — indicar que es un objeto JSON con condiciones especiales.
   - `priority` — explicar que a mayor número, mayor prioridad de aplicación.
   - `moneda` / `monedaOrigen` / `monedaDestino` — listar las monedas soportadas.
   - `tipoTransaccion` — aclarar la diferencia entre DEPOSITO, TRANSFERENCIA y RETIRO.
   - `tipoCuenta` — explicar AHORRO vs MONETARIA.
   - `internalNote` — aclarar que es solo visible para administradores.

4. Para los `<select>` y campos de tipo enum, asegúrate de que las opciones tengan **etiquetas en español legibles** en lugar de los valores del enum. Ejemplos:
   - `CASHBACK` → "Devolución de efectivo"
   - `RATE_REDUCTION` → "Reducción de tasa"
   - `FEE_WAIVER` → "Exención de comisión"
   - `BONUS_POINTS` → "Puntos de bonificación"
   - `DRAFT` → "Borrador"
   - `SCHEDULED` → "Programada"
   - `ACTIVE` → "Activa"
   - `PAUSED` → "Pausada"
   - `EXPIRED` → "Expirada"
   - `CANCELLED` → "Cancelada"
   - `USER_ROLE` → "Usuario"
   - `EMPLOYEE_ROLE` → "Empleado"
   - `ADMIN_ROLE` → "Administrador"
   - Y así para todos los demás enums que encuentres.

5. **En el backend**, revisa los mensajes de error en los validadores dentro de `middlewares/` y asegúrate de que todos los mensajes estén redactados de forma clara para el usuario final. Si encuentras mensajes muy técnicos o en inglés, tradúcelos y mejóralos.

---

## Orden de ejecución recomendado

1. Leer todos los modelos y middlewares antes de generar cualquier archivo.
2. Generar los seeds en este orden (respetando dependencias de referencias):
   - `seed_accounts.json`
   - `seed_account_requests.json`
   - `seed_services.json`
   - `seed_promotions.json`
   - `seed_transactions.json`
   - `seed_promotion_usages.json`
   - `seed_favorites.json`
3. Verificar que las referencias cruzadas sean consistentes entre archivos.
4. Proceder con los placeholders del frontend.
5. Revisar mensajes de error del backend.

---

## Entregables esperados

- [ ] Carpeta `Gestor_Bancario_Backend/seeds/` con un JSON por colección.
- [ ] Cada JSON con mínimo 8 documentos, usando todos los campos del schema.
- [ ] Frontend con placeholders, labels y helper texts en todos los formularios.
- [ ] Opciones de selects con etiquetas legibles en español.
- [ ] Mensajes de error del backend en español claro y orientado al usuario.

---

## Notas finales para el agente

- **No inventes campos** que no existan en los modelos. Si tienes duda sobre un campo, lee el modelo antes de escribir.
- **No omitas campos** por parecer opcionales; inclúyelos en los seeds para maximizar la cobertura de pruebas.
- Si encuentras inconsistencias entre un modelo y su validador (ej. un campo permitido en el modelo pero no en `allowed-fields.js`), documéntalo con un comentario `// INCONSISTENCIA DETECTADA` en el archivo afectado.
- Todos los datos monetarios deben ser numéricos válidos con máximo 2 decimales.
- Las fechas deben ser strings ISO 8601 válidos (ej. `"2025-03-15T00:00:00.000Z"`).
