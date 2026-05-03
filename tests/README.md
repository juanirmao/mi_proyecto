# 🧪 Suite de Pruebas - Proyecto Cartera

## 📋 **Descripción General**

Este directorio contiene el suite completo de pruebas de calidad para el Proyecto Cartera, implementado con las mejores herramientas y prácticas de la industria.

## 🛠️ **Herramientas Utilizadas**

### 1. **Postman** - Pruebas de API REST
- **Archivo:** `postman/proyecto-cartera-api-tests.postman_collection.json`
- **Propósito:** Validación funcional de endpoints
- **Coverage:** 100% de endpoints principales

### 2. **Cypress** - Pruebas End-to-End
- **Directorio:** `cypress/`
- **Propósito:** Simulación de flujos de usuario reales
- **Coverage:** UI completa y flujos de negocio

### 3. **Jest** - Pruebas Unitarias
- **Directorio:** `jest/`
- **Propósito:** Validación de lógica de negocio
- **Coverage:** Reglas críticas y validaciones

---

## 🚀 **Guía Rápida de Ejecución**

### **Requisitos Previos**
```bash
# Node.js 16+
# Docker y Docker Compose
# Postman Desktop (opcional)
```

### **1. Pruebas de API con Postman**

#### **Opción A: Postman Desktop**
1. Abrir Postman
2. Importar colección: `tests/postman/proyecto-cartera-api-tests.postman_collection.json`
3. Configurar variables de entorno:
   ```json
   {
     "baseUrl": "http://localhost:5000"
   }
   ```
4. Ejecutar la colección completa

#### **Opción B: Postman CLI (Newman)**
```bash
# Instalar Newman
npm install -g newman

# Ejecutar pruebas
newman run tests/postman/proyecto-cartera-api-tests.postman_collection.json \
  --environment tests/postman/environment.json \
  --reporters cli,html
```

### **2. Pruebas End-to-End con Cypress**

#### **Instalación**
```bash
cd tests/cypress
npm install
```

#### **Ejecución**
```bash
# Ejecución en modo headless
npx cypress run

# Ejecución con interfaz visual
npx cypress open

# Ejecución de tests específicos
npx cypress run --spec "cypress/e2e/dashboard.cy.js"
npx cypress run --spec "cypress/e2e/roi-solicitudes.cy.js"
npx cypress run --spec "cypress/e2e/sujetos-pasivos.cy.js"
```

### **3. Pruebas Unitarias con Jest**

#### **Instalación**
```bash
cd tests/jest
npm install
```

#### **Ejecución**
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con coverage
npm test -- --coverage

# Ejecutar en modo watch (desarrollo)
npm test -- --watch

# Ejecutar pruebas específicas
npm test -- backend/api.test.js
npm test -- backend/business-logic.test.js
```

---

## 📊 **Estructura de Tests**

### **Postman Tests**
```
postman/
├── proyecto-cartera-api-tests.postman_collection.json
└── environment.json
```

**Endpoints Probados:**
- ✅ Municipios (GET, POST, PUT, DELETE)
- ✅ Sujetos Pasivos (GET, POST, PUT)
- ✅ ROI Solicitudes (GET, POST, PUT)
- ✅ Validaciones de estado y fechas
- ✅ Manejo de Agente Especial

### **Cypress Tests**
```
cypress/
├── cypress.config.js
├── e2e/
│   ├── dashboard.cy.js          # Dashboard y estadísticas
│   ├── roi-solicitudes.cy.js    # ROI Solicitudes CRUD
│   └── sujetos-pasivos.cy.js    # Sujetos Pasivos CRUD
└── support/
    └── e2e.js
```

**Flujos Probados:**
- ✅ Dashboard: carga, errores, responsividad
- ✅ ROI Solicitudes: CRUD, estados, fechas, Agente Especial
- ✅ Sujetos Pasivos: CRUD, NIT, Agente Especial

### **Jest Tests**
```
jest/
├── jest.config.js
├── setup.js
└── backend/
    ├── api.test.js              # Tests de endpoints
    └── business-logic.test.js   # Lógica de negocio
```

**Módulos Probados:**
- ✅ API: validación, errores, seguridad
- ✅ Business Logic: estados, fechas, NIT, ROI

---

## 🎯 **Casos de Prueba Clave**

### **ROI Solicitudes**
- [x] Creación con estado BORRADOR
- [x] Transición a ENVIADO con fecha_envio
- [x] Transición a RESPONDIDO con fecha_respuesta
- [x] Toggle de Agente Especial
- [x] Validación de formulario
- [x] Eliminación segura

### **Sujetos Pasivos**
- [x] CRUD completo
- [x] Validación de NIT único
- [x] Gestión de Agente Especial
- [x] Relación con municipios

### **Dashboard**
- [x] Carga de estadísticas
- [x] Manejo de errores
- [x] Diseño responsivo
- [x] Navegación

---

## 📈 **Métricas Esperadas**

### **Postman**
- Tests totales: 15
- Success rate: 100%
- Response time: < 500ms

### **Cypress**
- Tests totales: 21
- Success rate: 100%
- Execution time: < 5s

### **Jest**
- Tests totales: 28
- Success rate: 100%
- Coverage: > 85%

---

## 🔧 **Configuración**

### **Variables de Entorno**
```json
{
  "baseUrl": "http://localhost:5000",
  "frontendUrl": "http://localhost:3000"
}
```

### **Docker para Tests**
```bash
# Iniciar servicios para pruebas
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

---

## 🐛 **Troubleshooting**

### **Problemas Comunes**

#### **1. "Connection refused" en API Tests**
```bash
# Verificar que el backend esté corriendo
docker-compose ps
docker-compose logs backend

# Reiniciar si es necesario
docker-compose restart backend
```

#### **2. "Element not found" en Cypress**
```bash
# Verificar que el frontend esté corriendo
docker-compose ps
docker-compose logs frontend

# Limpiar caché de Cypress
npx cypress cache clear
```

#### **3. "Database connection" en Jest**
```bash
# Verificar que la base de datos esté activa
docker-compose ps
docker-compose logs db

# Reiniciar base de datos
docker-compose restart db
```

### **Debug Tips**

#### **Postman**
- Usar console.log en scripts de test
- Revisar pestaña "Test Results"
- Habilitar "Show console logs"

#### **Cypress**
- Usar `cy.pause()` para debugging
- Revisar "Command Log"
- Usar `cy.debug()` para inspección

#### **Jest**
- Usar `console.log` en tests
- Ejecutar con `--verbose`
- Usar `--watch` para desarrollo

---

## 📋 **Checklist antes de Despliegue**

### **Pre-Production**
- [ ] Ejecutar suite completo de Postman
- [ ] Ejecutar suite completo de Cypress
- [ ] Ejecutar suite completo de Jest
- [ ] Verificar métricas de coverage
- [ ] Revisar informe de calidad

### **Validaciones Críticas**
- [ ] Todos los tests pasan (100%)
- [ ] Coverage > 85%
- [ ] Performance < 2s
- [ ] Sin errores críticos
- [ ] Funcionalidad completa

---

## 📞 **Soporte**

**Documentación Adicional:**
- [Informe de Calidad](./INFORME_CALIDAD.md)
- [Guía de Desarrollo](../docs/DEVELOPMENT.md)
- [API Documentation](../docs/API.md)

**Contacto del Equipo:**
- Calidad: Cascade AI Assistant
- Desarrollo: Equipo Proyecto Cartera

---

*Última actualización: 1 de Mayo de 2026*
