# Proyecto Cartera - Sistema de Gestión de ROI y Agentes Especiales

Sistema completo para la gestión de Requerimientos Ordinarios de Información (ROI), identificación de agentes especiales y liquidación del Impuesto de Alumbrado Público (IAP).

## Arquitectura

- **Frontend**: React.js con Bootstrap
- **Backend**: Node.js con Express.js
- **Base de Datos**: PostgreSQL
- **Contenedorización**: Docker & Docker Compose

## Requisitos del Sistema

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- PostgreSQL 15+ (proporcionado por Docker)

## Instalación y Ejecución

### Opción 1: Docker Compose (Recomendado)

1. **Clonar o navegar al directorio del proyecto**
   ```bash
   cd "c:\Users\JUAN JOSE\Desktop\proyecto cartera"
   ```

2. **Levantar todos los servicios**
   ```bash
   docker-compose up --build
   ```

3. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Base de datos: localhost:5432

### Opción 2: Desarrollo Local

1. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

2. **Instalar dependencias del frontend**
   ```bash
   cd ../frontend
   npm install
   ```

3. **Levantar PostgreSQL con Docker**
   ```bash
   docker run --name postgres-cartera -e POSTGRES_DB=proyecto_cartera -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   ```

4. **Ejecutar el backend**
   ```bash
   cd backend
   npm run dev
   ```

5. **Ejecutar el frontend (en otra terminal)**
   ```bash
   cd frontend
   npm start
   ```

## Estructura del Proyecto

```
proyecto cartera/
├── docker-compose.yml          # Configuración de Docker Compose
├── database/
│   └── init.sql               # Script de inicialización de BD
├── backend/
│   ├── Dockerfile             # Dockerfile para el backend
│   ├── package.json           # Dependencias del backend
│   ├── server.js              # Servidor Express principal
│   └── .env                   # Variables de entorno
└── frontend/
    ├── Dockerfile             # Dockerfile para el frontend
    ├── package.json           # Dependencias del frontend
    ├── public/
    │   └── index.html         # HTML principal
    └── src/
        ├── components/        # Componentes React reutilizables
        ├── pages/            # Páginas principales
        ├── App.js            # Componente principal
        └── index.js          # Punto de entrada
```

## Funcionalidades Principales

### 1. Gestión de Municipios
- Registro y administración de municipios
- Asociación con sujetos pasivos

### 2. Gestión de Sujetos Pasivos
- Identificación de posibles agentes especiales
- Clasificación por tipo (energía, financiero, etc.)
- Asociación con municipios

### 3. ROI (Requerimiento Ordinario de Información)
- Plantillas de ROI predefinidas
- Envío automatizado de solicitudes
- Procesamiento de respuestas

### 4. Liquidaciones IAP
- Cálculo automático basado en acuerdos municipales
- Generación de invitaciones a pago
- Seguimiento de estados

### 5. Gestión Documental
- Conversión PDF → Word/Excel
- Gestión de correspondencia
- Enlace con procesos

## API Endpoints

### Municipios
- `GET /api/municipios` - Listar municipios
- `POST /api/municipios` - Crear municipio

### Sujetos Pasivos
- `GET /api/sujetos-pasivos` - Listar sujetos pasivos
- `POST /api/sujetos-pasivos` - Crear sujeto pasivo

### ROI Solicitudes
- `GET /api/roi-solicitudes` - Listar solicitudes ROI
- `POST /api/roi-solicitudes` - Crear solicitud ROI

### Archivos
- `POST /api/upload` - Subir archivo

## Base de Datos

### Tablas Principales

- `municipios` - Información de municipios
- `sujetos_pasivos` - Posibles agentes especiales
- `roi_plantillas` - Plantillas de requerimientos
- `roi_solicitudes` - Solicitudes enviadas
- `liquidaciones_iap` - Liquidaciones del impuesto
- `documentos` - Gestión de archivos

## Desarrollo

### Volúmenes Persistentes

El `docker-compose.yml` incluye volúmenes persistentes para:
- Base de datos PostgreSQL (`postgres_data`)
- Código fuente del backend y frontend (para desarrollo)

### Variables de Entorno

**Backend (.env):**
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@postgres:5432/proyecto_cartera
```

## Próximas Funcionalidades

- [ ] Procesamiento automático de PDFs
- [ ] Conversión a formatos editables
- [ ] Generación automática de liquidaciones
- [ ] Sistema de notificaciones
- [ ] Dashboard con métricas avanzadas
- [ ] API de integración con sistemas externos

## Contribución

1. Crear rama para nueva funcionalidad
2. Desarrollar siguiendo los estándares del proyecto
3. Probar cambios con Docker Compose
4. Crear Pull Request

## Licencia

Este proyecto es parte de la práctica profesional de Juan José Ramírez.