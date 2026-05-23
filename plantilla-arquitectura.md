# Plantilla Conceptual de Arquitectura

Plantilla y análisis de la estructura genérica para replicar esta arquitectura (Frontend basado en *Features* y Backend modular por capas) en futuros proyectos independientemente del dominio.

## Fases de Estructuración (Pasos)
1. **Separación de Entornos (Cliente / Servidor)**: Mantener carpetas raíz o repositorios separados para clientes UI y servicios API, promoviendo el escalado independiente y despliegues aislados.
2. **Backend: Arquitectura Modular por Dominio**: Organizar el código fuente (`src/`) agrupando los archivos por entidad de negocio o "feature", en lugar de por el tipo de archivo técnico (evitando carpetas masivas de `controllers/` o `models/`).
3. **Backend: Flujo Estricto de 3 Capas**: Implementar el patrón unidireccional por cada módulo: `Rutas -> Controlador (HTTP) -> Servicio (Lógica de Negocio) -> Modelo (Base de Datos)`.
4. **Backend: Aislamiento Transversal**: Extraer lógicas comunes a nivel raíz del servidor: `configs/` (conexiones, configuraciones de terceros) y `middlewares/` (interceptores, validadores, manejo de errores).
5. **Frontend: Arquitectura Core**: Establecer la base en dos pilares principales: `app/` (para inicialización, enrutamiento global y *guards* de seguridad) y `shared/` (para componentes UI reutilizables, utilidades y clientes API).
6. **Frontend: Feature-Sliced Design (FSD)**: Desarrollar la aplicación agrupando por dominio en la carpeta `features/`. Cada feature debe ser autónomo y contener sus propias vistas, hooks, y estado global/local.

## Convención de Archivos y Responsabilidades

### Backend (`src/{feature}/`)
- `{feature}.model.js` — Representa la capa de datos. Define los esquemas, relaciones y se comunica directamente con la base de datos o el ORM.
- `{feature}.service.js` — Contiene la lógica de negocio pura. Debe ser agnóstica al protocolo HTTP (no debe conocer sobre `req` o `res`).
- `{feature}.controller.js` — Capa de presentación HTTP. Recibe la petición, extrae los datos (body, params), llama al servicio correspondiente, y formatea la respuesta (JSON) o maneja el catch de errores.
- `{feature}.routes.js` — Define los endpoints (GET, POST, etc.) y acopla los middlewares de seguridad o validación antes de llegar al controlador.

### Frontend (`src/`)
- `app/` — Contenedor principal de la aplicación. Configura el Router, los layouts globales y protege el acceso (`ProtectedRoute`, `RoleGuard`).
- `features/{feature}/` — Módulos aislados:
  - `components/`: Componentes de UI específicos para esta característica.
  - `hooks/`: Extracción de lógica compleja de los componentes (llamadas a la API, mutaciones).
  - `pages/`: Componentes contenedores que se mapean a una ruta (URL) específica.
  - `store/`: Estado de la aplicación (Zustand, Redux, Context) exclusivo para el dominio.
- `shared/` — Elementos reutilizables en toda la aplicación: `api/` (instancias base de fetch/axios), `components/layout/` (Navbar, Sidebar), `components/ui/` (Botones, Modales) y `utils/`.

## Verificación
1. **Bajo acoplamiento en Backend**: Validar que un módulo (`src/{feature}/`) pueda extraerse casi por completo para formar un microservicio independiente con un impacto mínimo.
2. **Controladores limpios**: Comprobar que los controladores no realicen cálculos de negocio ni interactúen con la base de datos de manera directa.
3. **Encapsulamiento en Frontend**: Verificar que un componente dentro de `features/{featureA}/` no importe directamente lógicas internas de `features/{featureB}/`. Si comparten algo, debe promoverse a la carpeta `shared/`.

## Decisiones de Estructura Repetibles (Patrones Aplicados)
- **Domain-Driven Design (DDD) Ligero**: Se prioriza la agrupación por "Concepto de Negocio" sobre la agrupación técnica. Esto facilita drásticamente que nuevos desarrolladores entiendan qué hace la aplicación.
- **Separation of Concerns (SoC)**: Alta cohesión y bajo acoplamiento. La capa de red (Rutas/Middlewares), la capa HTTP (Controladores) y la lógica de negocio (Servicios) operan sin mezclarse.
- **Agnosticismo de UI**: En el Frontend, los componentes visuales (`components/`) son mayoritariamente presentacionales, mientras que la obtención de datos y reglas se gestionan a través de abstracciones (`hooks/` y `store/`).