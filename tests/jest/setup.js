// Jest setup file
const { Pool } = require('pg');

// Mock database connection for testing
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Global test utilities
global.testUtils = {
  // Create mock request object
  createMockRequest: (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    ...overrides,
  }),

  // Create mock response object
  createMockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  },

  // Create mock next function
  createMockNext: () => jest.fn(),

  // Generate test data
  generateTestData: {
    municipio: {
      id: 1,
      nombre: 'Test Municipio',
      codigo: 'TEST001',
      departamento: 'Test Departamento',
      created_at: new Date(),
      updated_at: new Date(),
    },
    sujetoPasivo: {
      id: 1,
      nombre: 'Test Sujeto',
      tipo: 'Comercializadora',
      nit: '123456789',
      municipio_id: 1,
      es_agente_especial: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    roiSolicitud: {
      id: 1,
      numero_roi: 'TEST-ROI-001',
      municipio_id: 1,
      sujeto_pasivo_id: 1,
      roi_plantilla_id: 1,
      estado: 'BORRADOR',
      fecha_envio: null,
      fecha_respuesta: null,
      es_agente_especial: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  jest.restoreAllMocks();
});
