-- Database initialization for Proyecto Cartera
-- Create database and tables for ROI, Special Agents, and IAP management

-- Create database (if not exists)
-- Note: This is handled by POSTGRES_DB environment variable

-- Create tables
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'usuario', -- usuario, admin, supervisor
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS municipios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    departamento VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sujetos_pasivos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100), -- comercializadora, generadora, etc.
    nit VARCHAR(50) UNIQUE,
    municipio_id INTEGER REFERENCES municipios(id),
    es_agente_especial BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roi_plantillas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100), -- BASICO, EMPRESAS_ENERGIA, etc.
    descripcion TEXT,
    puntos_requeridos INTEGER DEFAULT 5,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roi_puntos (
    id SERIAL PRIMARY KEY,
    roi_plantilla_id INTEGER REFERENCES roi_plantillas(id),
    numero_punto INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    obligatorio BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roi_solicitudes (
    id SERIAL PRIMARY KEY,
    numero_roi VARCHAR(50) UNIQUE NOT NULL,
    municipio_id INTEGER REFERENCES municipios(id),
    sujeto_pasivo_id INTEGER REFERENCES sujetos_pasivos(id),
    roi_plantilla_id INTEGER REFERENCES roi_plantillas(id),
    estado VARCHAR(50) DEFAULT 'BORRADOR', -- BORRADOR, ENVIADO, RESPONDIDO, PROCESADO
    fecha_envio DATE,
    fecha_respuesta DATE,
    documento_respuesta_path VARCHAR(500),
    es_agente_especial BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roi_respuestas (
    id SERIAL PRIMARY KEY,
    roi_solicitud_id INTEGER REFERENCES roi_solicitudes(id),
    roi_punto_id INTEGER REFERENCES roi_puntos(id),
    respuesta TEXT,
    cumple BOOLEAN,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS acuerdos_municipales (
    id SERIAL PRIMARY KEY,
    municipio_id INTEGER REFERENCES municipios(id),
    anio INTEGER NOT NULL,
    porcentaje_iap DECIMAL(5,2), -- porcentaje del IAP
    valor_base DECIMAL(15,2), -- valor base para cálculo
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS liquidaciones_iap (
    id SERIAL PRIMARY KEY,
    sujeto_pasivo_id INTEGER REFERENCES sujetos_pasivos(id),
    municipio_id INTEGER REFERENCES municipios(id),
    anio INTEGER NOT NULL,
    valor_calculado DECIMAL(15,2),
    estado VARCHAR(50) DEFAULT 'PENDIENTE', -- PENDIENTE, ENVIADA, PAGADA
    invitacion_pago_id INTEGER,
    fecha_liquidacion DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invitaciones_pago (
    id SERIAL PRIMARY KEY,
    liquidacion_iap_id INTEGER REFERENCES liquidaciones_iap(id),
    numero_invitacion VARCHAR(50) UNIQUE NOT NULL,
    fecha_envio DATE,
    estado VARCHAR(50) DEFAULT 'PENDIENTE', -- PENDIENTE, ENVIADA, RESPONDIDA
    documento_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documentos (
    id SERIAL PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    tipo VARCHAR(50), -- PDF, WORD, EXCEL
    ruta_archivo VARCHAR(500) NOT NULL,
    entidad_tipo VARCHAR(50), -- roi_solicitudes, invitaciones_pago, etc.
    entidad_id INTEGER,
    tamano_bytes INTEGER,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS correspondencia (
    id SERIAL PRIMARY KEY,
    numero_radicado VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(50), -- ENTRADA, SALIDA
    asunto TEXT,
    destinatario VARCHAR(255),
    fecha_envio DATE,
    documento_adjunto_id INTEGER REFERENCES documentos(id),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_roi_solicitudes_municipio ON roi_solicitudes(municipio_id);
CREATE INDEX IF NOT EXISTS idx_roi_solicitudes_sujeto_pasivo ON roi_solicitudes(sujeto_pasivo_id);
CREATE INDEX IF NOT EXISTS idx_liquidaciones_iap_sujeto_pasivo ON liquidaciones_iap(sujeto_pasivo_id);
CREATE INDEX IF NOT EXISTS idx_liquidaciones_iap_municipio ON liquidaciones_iap(municipio_id);
CREATE INDEX IF NOT EXISTS idx_documentos_entidad ON documentos(entidad_tipo, entidad_id);

-- Insert some sample data
INSERT INTO municipios (nombre, codigo, departamento) VALUES
('La Calera', 'LC001', 'Cundinamarca'),
('Bogotá', 'BOG001', 'Cundinamarca')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO sujetos_pasivos (nombre, tipo, nit, municipio_id) VALUES
('CELSIA', 'Comercializadora de Energía', '123456789', 1),
('Banco Bogotá', 'Entidad Financiera', '987654321', 2)
ON CONFLICT (nit) DO NOTHING;

INSERT INTO roi_plantillas (nombre, tipo, descripcion, puntos_requeridos) VALUES
('ROI Básico', 'BASICO', 'Plantilla básica para identificación de agentes especiales', 5),
('ROI Empresas Energía', 'EMPRESAS_ENERGIA', 'Plantilla específica para empresas del sector energético', 8)
ON CONFLICT (nombre) DO NOTHING;