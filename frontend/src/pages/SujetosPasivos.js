import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const SujetosPasivos = () => {
  const [sujetos, setSujetos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    nit: '',
    municipio_id: '',
    es_agente_especial: false
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
      setFormData({ nombre: '', tipo: '', nit: '', municipio_id: '', es_agente_especial: false });
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

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(sujetos.map(s => s.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleEdit = () => {
    if (selectedItems.length === 1) {
      const item = sujetos.find(s => s.id === selectedItems[0]);
      setEditingItem(item);
      setFormData({
        nombre: item.nombre,
        tipo: item.tipo,
        nit: item.nit,
        municipio_id: item.municipio_id.toString(),
        es_agente_especial: item.es_agente_especial || false
      });
      setShowEditModal(true);
    } else {
      setError('Por favor selecciona exactamente un elemento para editar');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/sujetos-pasivos/${editingItem.id}`, formData);
      setShowEditModal(false);
      setEditingItem(null);
      setFormData({ nombre: '', tipo: '', nit: '', municipio_id: '', es_agente_especial: false });
      setSelectedItems([]);
      fetchData();
    } catch (err) {
      setError('Error al actualizar el sujeto pasivo');
      console.error('Error updating sujeto pasivo:', err);
    }
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      setError('Por favor selecciona al menos un elemento para eliminar');
      return;
    }
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedItems.length} sujeto(s) pasivo(s)?`)) {
      try {
        await Promise.all(
          selectedItems.map(id => axios.delete(`/api/sujetos-pasivos/${id}`))
        );
        setSelectedItems([]);
        fetchData();
      } catch (err) {
        setError('Error al eliminar los sujetos pasivos');
        console.error('Error deleting sujetos pasivos:', err);
      }
    }
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
            <div className="d-flex gap-2">
              {showCheckboxes ? (
                <>
                  <Button variant="outline-primary" onClick={handleEdit}>
                    Editar
                  </Button>
                  <Button variant="outline-danger" onClick={handleDelete}>
                    Eliminar
                  </Button>
                  <Button variant="outline-success" onClick={() => {setShowCheckboxes(false); setSelectedItems([]); setError(null);}}>
                    Listo
                  </Button>
                </>
              ) : (
                <Button variant="outline-info" onClick={() => setShowCheckboxes(true)}>
                  Seleccionar
                </Button>
              )}
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Agregar Sujeto Pasivo
              </Button>
            </div>
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
                    {showCheckboxes && (
                      <th>
                        <Form.Check
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedItems.length === sujetos.length && sujetos.length > 0}
                        />
                      </th>
                    )}
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
                      {showCheckboxes && (
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedItems.includes(sujeto.id)}
                            onChange={() => handleSelectItem(sujeto.id)}
                          />
                        </td>
                      )}
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

      {/* Modal para Editar Sujeto Pasivo */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Sujeto Pasivo</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
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

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Agente Especial"
                name="es_agente_especial"
                checked={formData.es_agente_especial}
                onChange={(e) => setFormData({
                  ...formData,
                  es_agente_especial: e.target.checked
                })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Actualizar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default SujetosPasivos;