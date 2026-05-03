const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proyecto Cartera API is running' });
});

// Municipios routes
app.get('/api/municipios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM municipios ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching municipios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/municipios', async (req, res) => {
  const { nombre, codigo, departamento } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO municipios (nombre, codigo, departamento) VALUES ($1, $2, $3) RETURNING *',
      [nombre, codigo, departamento]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating municipio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/municipios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, codigo, departamento } = req.body;
  try {
    const result = await pool.query(
      'UPDATE municipios SET nombre = $1, codigo = $2, departamento = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [nombre, codigo, departamento, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Municipio no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating municipio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/municipios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM municipios WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Municipio no encontrado' });
    }
    res.json({ message: 'Municipio eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting municipio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Sujetos Pasivos routes
app.get('/api/sujetos-pasivos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sp.*, m.nombre as municipio_nombre
      FROM sujetos_pasivos sp
      LEFT JOIN municipios m ON sp.municipio_id = m.id
      ORDER BY sp.nombre
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sujetos pasivos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/sujetos-pasivos', async (req, res) => {
  const { nombre, tipo, nit, municipio_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO sujetos_pasivos (nombre, tipo, nit, municipio_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, tipo, nit, municipio_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating sujeto pasivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/sujetos-pasivos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, nit, municipio_id, es_agente_especial } = req.body;
  try {
    const result = await pool.query(
      'UPDATE sujetos_pasivos SET nombre = $1, tipo = $2, nit = $3, municipio_id = $4, es_agente_especial = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [nombre, tipo, nit, municipio_id, es_agente_especial, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sujeto pasivo no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating sujeto pasivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/sujetos-pasivos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM sujetos_pasivos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sujeto pasivo no encontrado' });
    }
    res.json({ message: 'Sujeto pasivo eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting sujeto pasivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ROI Plantillas routes
app.get('/api/roi-plantillas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roi_plantillas WHERE activo = true ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ROI plantillas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ROI Solicitudes routes
app.get('/api/roi-solicitudes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT rs.*, m.nombre as municipio_nombre, sp.nombre as sujeto_pasivo_nombre,
             rp.nombre as plantilla_nombre, rs.fecha_respuesta
      FROM roi_solicitudes rs
      LEFT JOIN municipios m ON rs.municipio_id = m.id
      LEFT JOIN sujetos_pasivos sp ON rs.sujeto_pasivo_id = sp.id
      LEFT JOIN roi_plantillas rp ON rs.roi_plantilla_id = rp.id
      ORDER BY rs.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ROI solicitudes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/roi-solicitudes', async (req, res) => {
  const { numero_roi, municipio_id, sujeto_pasivo_id, roi_plantilla_id, estado, fecha_envio, fecha_respuesta } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO roi_solicitudes (numero_roi, municipio_id, sujeto_pasivo_id, roi_plantilla_id, estado, fecha_envio, fecha_respuesta)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [numero_roi, municipio_id, sujeto_pasivo_id, roi_plantilla_id, estado || 'BORRADOR', fecha_envio, fecha_respuesta]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating ROI solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/roi-solicitudes/:id', async (req, res) => {
  const { id } = req.params;
  const { numero_roi, municipio_id, sujeto_pasivo_id, roi_plantilla_id, estado, fecha_envio, fecha_respuesta, es_agente_especial } = req.body;
  try {
    const result = await pool.query(
      `UPDATE roi_solicitudes 
       SET numero_roi = $1, municipio_id = $2, sujeto_pasivo_id = $3, roi_plantilla_id = $4, estado = $5, fecha_envio = $6, fecha_respuesta = $7, es_agente_especial = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [numero_roi, municipio_id, sujeto_pasivo_id, roi_plantilla_id, estado || 'BORRADOR', fecha_envio, fecha_respuesta, es_agente_especial, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating ROI solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/roi-solicitudes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM roi_solicitudes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json({ message: 'Solicitud eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting ROI solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Liquidaciones IAP routes
app.get('/api/liquidaciones-iap', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT li.*, sp.nombre as sujeto_pasivo_nombre, m.nombre as municipio_nombre
      FROM liquidaciones_iap li
      LEFT JOIN sujetos_pasivos sp ON li.sujeto_pasivo_id = sp.id
      LEFT JOIN municipios m ON li.municipio_id = m.id
      ORDER BY li.fecha_liquidacion DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching liquidaciones IAP:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// File upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: req.file.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;