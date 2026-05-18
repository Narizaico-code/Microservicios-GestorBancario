# Prompt para Agente IA — Añadir campos faltantes en AuthService

## Contexto

En el proyecto **Gestor Bancario** hay dos servicios separados: `AuthService-GestionBancaria` (Sequelize + SQL) y `Gestor_Bancario_Backend` (Mongoose + MongoDB). Los datos personales del cliente (`fechaNacimiento`, `dpi`, `ingresosMensuales`) pertenecen al usuario, no a la cuenta bancaria, por lo que deben vivir en el **AuthService**. Debes añadirlos de forma consistente en todas las capas de ese servicio. No toques `Gestor_Bancario_Backend` salvo lo indicado explícitamente.

---

## Campos a añadir

| Campo | Tipo | Reglas de negocio |
|---|---|---|
| `fechaNacimiento` | Date | Obligatorio. El cliente debe ser mayor de 18 años al momento del registro. |
| `dpi` | String | Obligatorio. Exactamente 13 dígitos numéricos. Único por usuario. |
| `ingresosMensuales` | Number | Obligatorio. Mayor a 0. Máximo 2 decimales. En la misma moneda que la cuenta. |

---

## Alcance — qué archivos debes modificar

Antes de tocar cualquier archivo, léelo completo para entender su estructura y no romper lo que ya existe.

### 1. Modelos Sequelize — AuthService
- Abre `AuthService-GestionBancaria/src/users/user.model.js`. Los datos personales deben ir en el modelo `UserProfile`, que ya existe como tabla separada con relación `hasOne` hacia `User`. Añade allí los tres campos nuevos siguiendo el mismo estilo de definición de columnas que tiene el archivo.
- El campo `dpi` debe tener `unique: true`. `fechaNacimiento` y `dpi` no deben ser editables una vez guardados (no los incluyas en el modelo de update request). `ingresosMensuales` sí puede actualizarse.
- Abre `AuthService-GestionBancaria/src/users/user-update-request.model.js` y añade únicamente `ingresosMensuales` como campo actualizable.
- Abre `AuthService-GestionBancaria/src/auth/signup-request.model.js` y añade los tres campos, ya que el flujo de registro parte de ahí antes de crear el usuario.

### 2. Helpers y controladores — AuthService
- Busca en `AuthService-GestionBancaria/helpers/` los archivos que manejan la lógica de `registerUserHelper`, `createSignupRequest` y actualización de perfil. Incluye los tres campos en la creación y el guardado en `UserProfile`.
- En el helper de registro, añade validación de mayoría de edad: calcula la diferencia entre `fechaNacimiento` y la fecha actual; si es menor de 18 años, lanza un error con mensaje en español.
- Abre `AuthService-GestionBancaria/src/auth/signup-request.controller.js` y añade `fechaNacimiento`, `dpi` e `ingresosMensuales` a la desestructuración de `req.body` en `submitSignupRequest`, pasándolos al helper.

### 3. Frontend — formularios de registro y perfil
- Busca el componente de registro/signup (puede llamarse `Register`, `Signup`, `NuevoUsuario` o similar) y añade los tres campos con `label`, `placeholder` y texto de ayuda igual que se describe en la sección anterior.
- Busca el componente de edición de perfil y añade únicamente `ingresosMensuales` como campo editable, mostrando `fechaNacimiento` y `dpi` como texto de solo lectura si ya están guardados.

---

## Reglas que debes respetar

- No elimines ni renombres ningún campo existente.
- Mantén el estilo de código del archivo que estés editando (mismas convenciones de nombres, mismo formato de errores, mismo idioma en mensajes).
- Los mensajes de error deben estar en español y orientados al usuario final, no al desarrollador.
- Si el proyecto usa TypeScript, actualiza también los tipos o interfaces correspondientes.
- Si hay archivos de seed o datos de prueba en `seeds/`, actualiza al menos uno de los documentos de ejemplo para incluir los tres campos nuevos con valores válidos.

---

## Entregables esperados

- [ ] `user.model.js` — `UserProfile` con los tres campos nuevos e índice único en `dpi`.
- [ ] `signup-request.model.js` con los tres campos nuevos.
- [ ] `user-update-request.model.js` con solo `ingresosMensuales` añadido.
- [ ] Helper de registro con validación de mayoría de edad y guardado de los campos en `UserProfile`.
- [ ] `signup-request.controller.js` con los campos incluidos en `submitSignupRequest`.
- [ ] Formulario de registro en el frontend con los tres campos (inputs, labels, placeholders, helper texts y validación client-side).
- [ ] Formulario de edición de perfil con `ingresosMensuales` editable y `dpi` / `fechaNacimiento` en solo lectura.
