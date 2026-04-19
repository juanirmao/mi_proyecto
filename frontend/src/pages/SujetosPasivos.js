import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const SujetosPasivos = () => {
  const [sujetos, setSujetos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    nit: '',
    municipio_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sujetosRes, municipiosRes] = await Promise.all([
        axios.get('/api/sujetos-pasivos'),
        axios.get('/api/municipios')
      ]);
      setSujetos(sujetosRes.data);
      setMunicipios(municipiosRes.data);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/sujetos-pasivos', formData);
      setShowModal(false);
      setFormData({ nombre: '', tipo: '', nit: '', municipio_id: '' });
      fetchData();
    } catch (err) {
      setError('Error al crear el sujeto pasivo');
      console.error('Error creating sujeto pasivo:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Sujetos Pasivos</h1>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Agregar Sujeto Pasivo
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>NIT</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Municipio</th>
                    <th>Agente Especial</th>
                  </tr>
                </thead>
                <tbody>
                  {sujetos.map((sujeto) => (
                    <tr key={sujeto.id}>
                      <td>{sujeto.nit}</td>
                      <td>{sujeto.nombre}</td>
                      <td>{sujeto.tipo}</td>
                      <td>{sujeto.municipio_nombre}</td>
                      <td>
                        <span className={`badge ${sujeto.es_agente_especial ? 'bg-success' : 'bg-secondary'}`}>
                          {sujeto.es_agente_especial ? 'Sí' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para agregar sujeto pasivo */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Sujeto Pasivo</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                placeholder="Ej: Comercializadora de Energía"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>NIT</Form.Label>
              <Form.Control
                type="text"
                name="nit"
                value={formData.nit}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Municipio</Form.Label>
              <Form.Select
                name="municipio_id"
                value={formData.municipio_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar municipio</option>
                {municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.id}>
                    {municipio.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default SujetosPasivos;