# Estructura Frontend — `client-user` (React Native + Expo)

Documento de referencia de la arquitectura frontend de la app de usuario
**Kinal Sports**, pensado para poder **replicar o continuar el desarrollo**
en otro proyecto React Native.

---

## 1. Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | **Expo SDK 55** + React Native 0.83.6 |
| Lenguaje | JavaScript (JSX, sin TypeScript) |
| Navegación | **React Navigation 7** (native-stack + bottom-tabs) |
| Estado global | **Zustand 5** (con middleware `persist`) |
| Formularios | **react-hook-form 7** (patrón `Controller`) |
| HTTP | **Axios** (instancias separadas con interceptores) |
| Almacenamiento | `AsyncStorage` (datos no sensibles) + `expo-secure-store` (refreshToken) |
| Iconos | `@expo/vector-icons` (`MaterialIcons`) |

**Arquitectura clave:** *Feature-based / screaming architecture* — el código se
organiza por **funcionalidad de negocio** (`auth`, `fields`, `profile`), no por
tipo de archivo. Todo lo transversal vive en `shared/`.

---

## 2. Árbol de carpetas

```
client-user/
├── App.jsx                  # Raíz: SafeAreaProvider + AppNavigator + StatusBar
├── index.js                 # registerRootComponent(App) — punto de entrada Expo
├── app.json                 # Config Expo (nombre, iconos, splash, plugins)
├── package.json
├── .env                     # Variables EXPO_PUBLIC_* (URLs de API)
├── assets/                  # Imágenes estáticas (logo, avatar, iconos, splash)
│
└── src/
    ├── navigation/          # Definición de la navegación (3 archivos)
    │   ├── AppNavigator.jsx     # Router raíz: decide Auth vs Main según sesión
    │   ├── AuthStack.jsx        # Stack: Login + Register (sin sesión)
    │   └── MainTabs.jsx         # Tabs inferiores + stacks anidados (con sesión)
    │
    ├── features/            # ← El corazón. Una carpeta por dominio.
    │   ├── auth/
    │   │   ├── hooks/useAuth.js
    │   │   └── screens/{LoginScreen, RegisterScreen}.jsx
    │   ├── fields/
    │   │   ├── hooks/useFields.js
    │   │   └── screens/{FieldsScreen, FieldDetailScreen}.jsx
    │   └── profile/
    │       └── screens/ProfileScreen.jsx
    │
    └── shared/             # Código reutilizable transversal
        ├── api/            # Clientes Axios (authClient, userClient)
        ├── store/          # Zustand stores globales (authStore)
        ├── constants/      # theme.js (design tokens) + endpoints.js
        └── components/     # Componentes UI reutilizables (Button, Input, Common)
```

---

## 3. Capa de navegación (`src/navigation/`)

Patrón de **navegación condicional por autenticación** en tres niveles:

**`AppNavigator.jsx`** — el árbitro:
- Lee `isAuthenticated` y `_hasHydrated` del `authStore`.
- Mientras Zustand **rehidrata** desde AsyncStorage (`!isHydrated`), muestra un
  `ActivityIndicator` (evita el "parpadeo" de mostrar Login antes de saber si hay
  sesión guardada).
- Renderiza `<MainTabs />` si hay sesión, o `<AuthStack />` si no. **No** hay
  rutas protegidas individuales: se intercambia el árbol de navegación completo.

**`AuthStack.jsx`** — native-stack con `headerShown: false`, contiene `Login` y
`Register`.

**`MainTabs.jsx`** — `BottomTabNavigator` con:
- Estilos de tab tomados de `COLORS` (tema centralizado).
- `tabBarIcon` resuelto por nombre de ruta vía un `if/else` que mapea a iconos
  `MaterialIcons`.
- **Stacks anidados dentro de tabs**: el tab "Fields" no apunta a una screen
  directa sino a `FieldsStack` (un `NativeStackNavigator` con
  `FieldsList` → `FieldDetail`). Esto permite navegar a detalle manteniendo la
  barra de tabs. El patrón es escalable para los tabs comentados (Teams,
  Tournaments, Reservations).

---

## 4. Capa de features (`src/features/`)

Cada feature replica la **misma micro-estructura interna**:

```
feature/
├── hooks/      # Lógica de negocio + llamadas a API (toda la "inteligencia")
└── screens/    # Componentes de pantalla (solo presentación + wiring)
```

> Convención: las **screens son "tontas"** (renderizan y delegan); los **hooks
> contienen el estado y la comunicación con el backend**. Esto mantiene las
> screens legibles y la lógica testeable/reutilizable.

### 4.1 Patrón de Hooks — el más importante a replicar

**`useAuth.js`** (auth):
- Encapsula `handleLogin` y `handleRegister`.
- Maneja su propio estado local: `loading` y `error` (vía `useState`).
- Llama a `authClient`, y en login hace **mapeo defensivo** de la respuesta
  (acepta `accessToken`/`token`, `userDetails`/`user`) para tolerar variaciones
  del backend.
- Conecta con el store global: obtiene la acción `login` del `authStore` y la
  invoca tras éxito.
- En register construye un `FormData` (`multipart/form-data`).
- **Retorna un objeto** `{ handleLogin, handleRegister, loading, error, logout }`
  que la screen consume.

**`useFields.js`** (fields) — patrón de *data-fetching*:
- Estado triple estándar: `{ data, loading, error }` (aquí `fields`, `loading`,
  `error`).
- `getFields` envuelto en `useCallback` (referencia estable) y disparado por un
  `useEffect` al montar.
- **Capa "ViewModel"**: `mapFieldToViewModel` transforma la entidad cruda del
  backend (`fieldName`, `photo`, `isActive`) a un modelo que la UI entiende
  (`name`, `image`, `isAvailable`, `location` derivada). Desacopla la UI de la
  forma exacta del API.
- Lectura defensiva: `response.data.data || response.data || []`.
- Retorna `getFields` para permitir *pull-to-refresh* desde la screen.

### 4.2 Patrón de Screens

- Reciben `{ navigation, route }` por props (inyectadas por React Navigation).
- Consumen su hook (`const { fields, loading, getFields } = useFields()`).
- **Formularios con react-hook-form**: usan `useForm({ defaultValues })` +
  `<Controller>` envolviendo cada `<Input>`. Las reglas de validación
  (`required`, `pattern`, `minLength`) se declaran inline en cada Controller; los
  errores se pasan a `Input` vía `error={errors.campo?.message}`.
- Submit: `onPress={handleSubmit(onSubmit)}`, con `try/catch` que muestra
  `Alert.alert` en error.
- **Sub-componentes locales**: p. ej. `FieldCard` se define en el mismo archivo
  de `FieldsScreen` porque solo se usa ahí (no se "sube" a shared hasta que se
  reutilice).
- Listas con `FlatList` + `RefreshControl` + `ListEmptyComponent`.
- Cada screen define sus estilos al final con `StyleSheet.create`, **consumiendo
  siempre los tokens** de `theme.js` (nunca colores/espaciados hardcodeados,
  salvo placeholders puntuales).

---

## 5. Capa compartida (`src/shared/`)

### 5.1 `shared/api/` — Clientes Axios con interceptores

Dos instancias separadas por dominio de backend:
- **`authClient`** → microservicio de autenticación (`ENDPOINTS.AUTH`).
- **`userClient`** → microservicio de usuario/canchas (`ENDPOINTS.USER`).

Ambos comparten el mismo patrón:
1. **Request interceptor**: inyecta `Authorization: Bearer <token>` leyendo
   `useAuthStore.getState().token` (acceso al store *fuera* de React).
2. **Response interceptor con refresh-token automático**: ante un `401`, usa una
   cola (`failedQueue` + flag `isRefreshing`) para **encolar peticiones
   concurrentes** mientras se renueva el token una sola vez; obtiene el
   `refreshToken` de `SecureStore`, llama a `/refresh`, actualiza el access token
   en el store y reintenta las peticiones. Si el refresh falla → `logout()`.
3. `authClient` añade una guarda extra: **no** intenta refresh en endpoints de
   auth (`/login`, `/register`, etc.) porque un 401 ahí es credencial inválida,
   no token expirado.

### 5.2 `shared/store/authStore.js` — Estado global con Zustand

- `create(persist(...))` con **persistencia en AsyncStorage**
  (`name: "auth-storage"`).
- Estado: `token`, `user`, `isAuthenticated`, `_hasHydrated`.
- Acciones: `login` (guarda en memoria + `refreshToken` en SecureStore),
  `logout` (limpia todo + borra SecureStore), `setAccessToken` (solo memoria,
  para el refresh).
- **Separación de seguridad**: el `refreshToken` (sensible) va a
  **expo-secure-store** cifrado; el resto del estado a AsyncStorage.
- `onRehydrateStorage` marca `_hasHydrated: true` → es lo que `AppNavigator`
  espera para evitar el parpadeo de sesión.
- Se accede tanto con hook reactivo
  (`useAuthStore((s) => s.isAuthenticated)`) en componentes, como imperativo
  (`useAuthStore.getState()`) en los interceptores Axios.

### 5.3 `shared/constants/`
- **`theme.js`**: *design tokens* exportados — `COLORS`, `SPACING`, `FONT_SIZE`,
  `SHADOWS`. Es la **única fuente de verdad de estilos**; toda la app importa de
  aquí. Replicar esto primero garantiza consistencia visual.
- **`endpoints.js`**: URLs base leídas de `process.env.EXPO_PUBLIC_*` con
  *fallback* a localhost.

### 5.4 `shared/components/` — UI reutilizable
- **`Button.jsx`**: botón con prop `variant` (`primary`/`secondary`), estado
  `loading` (muestra `ActivityIndicator`), reenvía `...props` y permite override
  de `style`.
- **`Input.jsx`**: wrapper de `TextInput` con `label` y `error` integrados;
  spread de `...props` para pasar `secureTextEntry`, `keyboardType`, etc.
- **`Common.jsx`**: exporta varios primitivos — `LoadingSpinner`, `EmptyState`,
  `Card`.

> **Patrón de reutilización:** componentes pequeños y composables, controlados
> por props, sin estado propio (excepto el necesario), siempre estilizados con
> los tokens del tema.

---

## 6. Observaciones importantes para replicar (deuda técnica detectada)

Al portar/desarrollar, conviene **corregir/unificar** estas inconsistencias
presentes en el código actual:

1. **Componentes duplicados**: existen `shared/components/Button.jsx` **y**
   `shared/components/common/Button.jsx` (idénticos), igual con `Input` y
   `Common`. Las screens importan de rutas distintas (`LoginScreen` usa
   `components/`, `ProfileScreen` usa `components/common/`).
   → **Unificar en una sola ubicación** (recomendado: `shared/components/common/`
   o un `index.js` barril).
2. **Typos de props**: `<StatusBar sytle="auto" />` (App.jsx),
   `<Text sytle=...>` (LoginScreen) — `sytle` no aplica estilos.
3. **Bug en `RegisterScreen`**: falta una coma en `Alert.alert(...)` entre el
   mensaje y el array de botones → el array se indexa sobre el string.
4. **Inconsistencia login**: el form envía `emailOrUsername` pero el
   backend/`useAuth` espera `email`/`username`.
5. `COLORS.white` se usa en estilos pero **no está definido** en `theme.js`.
6. Pantallas con lógica incompleta: `ProfileScreen` (formulario declarado pero
   `onSubmit` vacío y campos no renderizados) y
   `FieldDetailScreen.handleReservation` vacío.

---

## 7. Plantilla mental para crear un nuevo feature

Para añadir, p. ej., un módulo `reservations`, replica este molde:

```
src/features/reservations/
├── hooks/useReservations.js     # useState(data/loading/error) + useCallback + useEffect
│                                  # + mapXToViewModel + llamada a userClient
└── screens/
    ├── ReservationsScreen.jsx    # FlatList + hook + sub-componente Card local
    └── ReservationDetailScreen.jsx
```

Luego: añade el stack/tab en `MainTabs.jsx`, define el icono en `tabBarIcon`, y
reutiliza `Button`, `Input`, `Card`, `EmptyState`, `LoadingSpinner` + tokens de
`theme.js`.

---

## 8. Flujo de datos resumido

```
Screen (UI + react-hook-form)
   │  consume
   ▼
Hook de feature (useState loading/error + mapToViewModel)
   │  llama
   ▼
Cliente Axios (authClient / userClient)
   │  interceptor request → inyecta token desde authStore
   │  interceptor response → refresh automático en 401
   ▼
Backend (microservicios AUTH / USER)

authStore (Zustand + persist)
   ├── AsyncStorage      → token, user, isAuthenticated (rehidratación)
   └── expo-secure-store → refreshToken (cifrado)
```
