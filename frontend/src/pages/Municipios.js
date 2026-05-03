import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const Municipios = () => {
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
    codigo: '',
    departamento: ''
  });

  useEffect(() => {
    fetchMunicipios();
  }, []);

  const fetchMunicipios = async () => {
    try {
      const response = await axios.get('/api/municipios');
      setMunicipios(response.data);
    } catch (err) {
      setError('Error al cargar los municipios');
      console.error('Error fetching municipios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/municipios', formData);
      setShowModal(false);
      setFormData({ nombre: '', codigo: '', departamento: '' });
      fetchMunicipios();
    } catch (err) {
      setError('Error al crear el municipio');
      console.error('Error creating municipio:', err);
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
      setSelectedItems(municipios.map(m => m.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleEdit = () => {
    if (selectedItems.length === 1) {
      const item = municipios.find(m => m.id === selectedItems[0]);
      setEditingItem(item);
      setFormData({
        nombre: item.nombre,
        codigo: item.codigo,
        departamento: item.departamento
      });
      setShowEditModal(true);
    } else {
      setError('Por favor selecciona exactamente un elemento para editar');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/municipios/${editingItem.id}`, formData);
      setShowEditModal(false);
      setEditingItem(null);
      setFormData({ nombre: '', codigo: '', departamento: '' });
      setSelectedItems([]);
      fetchMunicipios();
    } catch (err) {
      setError('Error al actualizar el municipio');
      console.error('Error updating municipio:', err);
    }
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      setError('Por favor selecciona al menos un elemento para eliminar');
      return;
    }
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedItems.length} municipio(s)?`)) {
      try {
        await Promise.all(
          selectedItems.map(id => axios.delete(`/api/municipios/${id}`))
        );
        setSelectedItems([]);
        fetchMunicipios();
      } catch (err) {
        setError('Error al eliminar los municipios');
        console.error('Error deleting municipios:', err);
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
            <h1>Gestión de Municipios</h1>
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
                Agregar Municipio
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
                          checked={selectedItems.length === municipios.length && municipios.length > 0}
                        />
                      </th>
                    )}
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Departamento</th>
                    <th>Fecha Creación</th>
                  </tr>
                </thead>
                <tbody>
                  {municipios.map((municipio) => (
                    <tr key={municipio.id}>
                      {showCheckboxes && (
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedItems.includes(municipio.id)}
                            onChange={() => handleSelectItem(municipio.id)}
                          />
                        </td>
                      )}
                      <td>{municipio.codigo}</td>
                      <td>{municipio.nombre}</td>
                      <td>{municipio.departamento}</td>
                      <td>{new Date(municipio.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para agregar municipio */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Municipio</Modal.Title>
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
              <Form.Label>Código</Form.Label>
              <Form.Control
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Departamento</Form.Label>
              <Form.Control
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                required
              />
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

      {/* Modal para Editar Municipio */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Municipio</Modal.Title>
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
              <Form.Label>Código</Form.Label>
              <Form.Control
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Departamento</Form.Label>
              <Form.Control
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                required
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

export default Municipios;