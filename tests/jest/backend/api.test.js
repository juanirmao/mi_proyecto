const request = require('supertest');
const express = require('express');
const { Pool } = require('pg');

// Import the server (we'll need to export the app from server.js)
const app = require('../../../backend/server.js');

describe('Proyecto Cartera API Tests', () => {
  let mockPool;

  beforeEach(() => {
    // Mock the database pool
    mockPool = new Pool();
    jest.spyOn(mockPool, 'query');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message', 'Proyecto Cartera API is running');
    });
  });

  describe('Municipios API', () => {
    describe('GET /api/municipios', () => {
      it('should return all municipios', async () => {
        const mockMunicipios = [
          { id: 1, nombre: 'Bogotá', codigo: 'BOG001', departamento: 'Cundinamarca' },
          { id: 2, nombre: 'Medellín', codigo: 'MED001', departamento: 'Antioquia' },
        ];

        mockPool.query.mockResolvedValue({ rows: mockMunicipios });

        const response = await request(app)
          .get('/api/municipios')
          .expect(200);

        expect(response.body).toEqual(mockMunicipios);
        expect(mockPool.query).toHaveBeenCalledWith(
          'SELECT * FROM municipios ORDER BY nombre'
        );
      });

      it('should handle database errors', async () => {
        mockPool.query.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
          .get('/api/municipios')
          .expect(500);

        expect(response.body).toHaveProperty('error', 'Error interno del servidor');
      });
    });

    describe('POST /api/municipios', () => {
      it('should create a new municipio', async () => {
        const newMunicipio = {
          nombre: 'Test City',
          codigo: 'TEST001',
          departamento: 'Test Department'
        };

        const createdMunicipio = {
          id: 3,
          ...newMunicipio,
          created_at: new Date(),
          updated_at: new Date()
        };

        mockPool.query.mockResolvedValue({ rows: [createdMunicipio] });

        const response = await request(app)
          .post('/api/municipios')
          .send(newMunicipio)
          .expect(201);

        expect(response.body).toEqual(createdMunicipio);
        expect(mockPool.query).toHaveBeenCalledWith(
          'INSERT INTO municipios (nombre, codigo, departamento) VALUES ($1, $2, $3) RETURNING *',
          [newMunicipio.nombre, newMunicipio.codigo, newMunicipio.departamento]
        );
      });

      it('should validate required fields', async () => {
        const invalidMunicipio = { nombre: 'Test City' }; // Missing codigo and departamento

        const response = await request(app)
          .post('/api/municipios')
          .send(invalidMunicipio)
          .expect(500);

        expect(response.body).toHaveProperty('error');
      });
    });

    describe('PUT /api/municipios/:id', () => {
      it('should update a municipio', async () => {
        const updatedMunicipio = {
          id: 1,
          nombre: 'Updated City',
          codigo: 'UPD001',
          departamento: 'Updated Department',
          created_at: new Date(),
          updated_at: new Date()
        };

        mockPool.query.mockResolvedValue({ rows: [updatedMunicipio] });

        const response = await request(app)
          .put('/api/municipios/1')
          .send({
            nombre: 'Updated City',
            codigo: 'UPD001',
            departamento: 'Updated Department'
          })
          .expect(200);

        expect(response.body).toEqual(updatedMunicipio);
      });

      it('should return 404 for non-existent municipio', async () => {
        mockPool.query.mockResolvedValue({ rows: [] });

        const response = await request(app)
          .put('/api/municipios/999')
          .send({
            nombre: 'Updated City',
            codigo: 'UPD001',
            departamento: 'Updated Department'
          })
          .expect(404);

        expect(response.body).toHaveProperty('error', 'Municipio no encontrado');
      });
    });
  });

  describe('Sujetos Pasivos API', () => {
    describe('GET /api/sujetos-pasivos', () => {
      it('should return all sujetos pasivos with municipio names', async () => {
        const mockSujetos = [
          {
            id: 1,
            nombre: 'Test Sujeto',
            tipo: 'Comercializadora',
            nit: '123456789',
            municipio_id: 1,
            es_agente_especial: false,
            municipio_nombre: 'Bogotá'
          }
        ];

        mockPool.query.mockResolvedValue({ rows: mockSujetos });

        const response = await request(app)
          .get('/api/sujetos-pasivos')
          .expect(200);

        expect(response.body).toEqual(mockSujetos);
        expect(mockPool.query).toHaveBeenCalledWith(
          expect.stringContaining('SELECT sp.*, m.nombre as municipio_nombre')
        );
      });
    });

    describe('POST /api/sujetos-pasivos', () => {
      it('should create a new sujeto pasivo', async () => {
        const newSujeto = {
          nombre: 'Test Company',
          tipo: 'Generadora',
          nit: '987654321',
          municipio_id: 1
        };

        const createdSujeto = {
          id: 2,
          ...newSujeto,
          created_at: new Date(),
          updated_at: new Date()
        };

        mockPool.query.mockResolvedValue({ rows: [createdSujeto] });

        const response = await request(app)
          .post('/api/sujetos-pasivos')
          .send(newSujeto)
          .expect(201);

        expect(response.body).toEqual(createdSujeto);
        expect(mockPool.query).toHaveBeenCalledWith(
          'INSERT INTO sujetos_pasivos (nombre, tipo, nit, municipio_id) VALUES ($1, $2, $3, $4) RETURNING *',
          [newSujeto.nombre, newSujeto.tipo, newSujeto.nit, newSujeto.municipio_id]
        );
      });
    });

    describe('PUT /api/sujetos-pasivos/:id', () => {
      it('should update a sujeto pasivo including es_agente_especial', async () => {
        const updatedSujeto = {
          id: 1,
          nombre: 'Updated Company',
          tipo: 'Comercializadora',
          nit: '123456789',
          municipio_id: 1,
          es_agente_especial: true,
          created_at: new Date(),
          updated_at: new Date()
        };

        mockPool.query.mockResolvedValue({ rows: [updatedSujeto] });

        const response = await request(app)
          .put('/api/sujetos-pasivos/1')
          .send({
            nombre: 'Updated Company',
            tipo: 'Comercializadora',
            nit: '123456789',
            municipio_id: 1,
            es_agente_especial: true
          })
          .expect(200);

        expect(response.body).toEqual(updatedSujeto);
        expect(mockPool.query).toHaveBeenCalledWith(
          'UPDATE sujetos_pasivos SET nombre = $1, tipo = $2, nit = $3, municipio_id = $4, es_agente_especial = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
          ['Updated Company', 'Comercializadora', '123456789', 1, true, 1]
        );
      });
    });
  });

  describe('ROI Solicitudes API', () => {
    describe('GET /api/roi-solicitudes', () => {
      it('should return all ROI solicitudes with related data', async () => {
        const mockSolicitudes = [
          {
            id: 1,
            numero_roi: 'TEST-ROI-001',
            municipio_id: 1,
            sujeto_pasivo_id: 1,
            roi_plantilla_id: 1,
            estado: 'BORRADOR',
            fecha_envio: null,
            fecha_respuesta: null,
            es_agente_especial: false,
            municipio_nombre: 'Bogotá',
            sujeto_pasivo_nombre: 'Test Sujeto',
            plantilla_nombre: 'ROI Básico'
          }
        ];

        mockPool.query.mockResolvedValue({ rows: mockSolicitudes });

        const response = await request(app)
          .get('/api/roi-solicitudes')
          .expect(200);

        expect(response.body).toEqual(mockSolicitudes);
        expect(mockPool.query).toHaveBeenCalledWith(
          expect.stringContaining('SELECT rs.*, m.nombre as municipio_nombre')
        );
      });
    });

    describe('POST /api/roi-solicitudes', () => {
      it('should create a new ROI solicitud', async () => {
        const newSolicitud = {
          numero_roi: 'TEST-ROI-002',
          municipio_id: 1,
          sujeto_pasivo_id: 1,
          roi_plantilla_id: 1,
          estado: 'BORRADOR',
          fecha_envio: null,
          fecha_respuesta: null,
          es_agente_especial: false
        };

        const createdSolicitud = {
          id: 2,
          ...newSolicitud,
          created_at: new Date(),
          updated_at: new Date()
        };

        mockPool.query.mockResolvedValue({ rows: [createdSolicitud] });

        const response = await request(app)
          .post('/api/roi-solicitudes')
          .send(newSolicitud)
          .expect(201);

        expect(response.body).toEqual(createdSolicitud);
        expect(mockPool.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO roi_solicitudes'),
          expect.arrayContaining([
            newSolicitud.numero_roi,
            newSolicitud.municipio_id,
            newSolicitud.sujeto_pasivo_id,
            newSolicitud.roi_plantilla_id,
            newSolicitud.estado,
            newSolicitud.fecha_envio,
            newSolicitud.fecha_respuesta
          ])
        );
      });
    });

    describe('PUT /api/roi-solicitudes/:id', () => {
      it('should update a ROI solicitud to ENVIADO state', async () => {
        const updatedSolicitud = {
          id: 1,
          numero_roi: 'TEST-ROI-001',
          municipio_id: 1,
          sujeto_pasivo_id: 1,
          roi_plantilla_id: 1,
          estado: 'ENVIADO',
          fecha_envio: '2024-05-01',
          fecha_respuesta: null,
          es_agente_especial: true,
          created_at: new Date(),
          updated_at: new Date()
        };

        mockPool.query.mockResolvedValue({ rows: [updatedSolicitud] });

        const response = await request(app)
          .put('/api/roi-solicitudes/1')
          .send({
            numero_roi: 'TEST-ROI-001',
            municipio_id: 1,
            sujeto_pasivo_id: 1,
            roi_plantilla_id: 1,
            estado: 'ENVIADO',
            fecha_envio: '2024-05-01',
            fecha_respuesta: null,
            es_agente_especial: true
          })
          .expect(200);

        expect(response.body).toEqual(updatedSolicitud);
        expect(mockPool.query).toHaveBeenCalledWith(
          expect.stringContaining('UPDATE roi_solicitudes'),
          expect.arrayContaining([
            'TEST-ROI-001',
            1,
            1,
            1,
            'ENVIADO',
            '2024-05-01',
            null,
            true,
            1
          ])
        );
      });

      it('should update a ROI solicitud to RESPONDIDO state with fecha_respuesta', async () => {
        const updatedSolicitud = {
          id: 1,
          numero_roi: 'TEST-ROI-001',
          municipio_id: 1,
          sujeto_pasivo_id: 1,
          roi_plantilla_id: 1,
          estado: 'RESPONDIDO',
          fecha_envio: null,
          fecha_respuesta: '2024-05-01',
          es_agente_especial: false,
          created_at: new Date(),
          updated_at: new Date()
        };

        mockPool.query.mockResolvedValue({ rows: [updatedSolicitud] });

        const response = await request(app)
          .put('/api/roi-solicitudes/1')
          .send({
            numero_roi: 'TEST-ROI-001',
            municipio_id: 1,
            sujeto_pasivo_id: 1,
            roi_plantilla_id: 1,
            estado: 'RESPONDIDO',
            fecha_envio: null,
            fecha_respuesta: '2024-05-01',
            es_agente_especial: false
          })
          .expect(200);

        expect(response.body).toEqual(updatedSolicitud);
        expect(response.body.estado).toBe('RESPONDIDO');
        expect(response.body.fecha_respuesta).toBe('2024-05-01');
        expect(response.body.es_agente_especial).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors for non-existent resources', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/municipios/999')
        .send({ nombre: 'Test', codigo: 'TEST', departamento: 'Test' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle database connection errors', async () => {
      mockPool.query.mockRejectedValue(new Error('Connection failed'));

      const response = await request(app)
        .get('/api/municipios')
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Error interno del servidor');
    });

    it('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/api/municipios')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
