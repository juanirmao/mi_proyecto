import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const ROISolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [municipios, setMunicipios] = useState([]);
  const [sujetosPasivos, setSujetosPasivos] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [formData, setFormData] = useState({
    numero_roi: '',
    municipio_id: '',
    sujeto_pasivo_id: '',
    roi_plantilla_id: '',
    estado: 'BORRADOR',
    fecha_envio: '',
    fecha_respuesta: '',
    es_agente_especial: false
  });

  useEffect(() => {
    fetchSolicitudes();
    fetchMunicipios();
    fetchSujetosPasivos();
    fetchPlantillas();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const response = await axios.get('/api/roi-solicitudes', {
        params: { _t: Date.now() }
      });
      setSolicitudes(response.data);
    } catch (err) {
      setError('Error al cargar las solicitudes ROI');
      console.error('Error fetching ROI solicitudes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMunicipios = async () => {
    try {
      const response = await axios.get('/api/municipios');
      setMunicipios(response.data);
    } catch (err) {
      console.error('Error fetching municipios:', err);
    }
  };

  const fetchSujetosPasivos = async () => {
    try {
      const response = await axios.get('/api/sujetos-pasivos');
      setSujetosPasivos(response.data);
    } catch (err) {
      console.error('Error fetching sujetos pasivos:', err);
    }
  };

  const fetchPlantillas = async () => {
    try {
      const response = await axios.get('/api/roi-plantillas');
      setPlantillas(response.data);
    } catch (err) {
      console.error('Error fetching plantillas:', err);
    }
  };

  const handleInputChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);
    // Debug para verificar el cambio de estado
    if (e.target.name === 'estado') {
      console.log('Estado cambiado a:', e.target.value);
      console.log('formData.estado:', newFormData.estado);
    }
  };

  const handleSetCurrentDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      ...formData,
      fecha_envio: today
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      
      // Si el estado es RESPONDIDO y no hay fecha, establecer fecha actual
      if (dataToSend.estado === 'RESPONDIDO' && !dataToSend.fecha_respuesta) {
        dataToSend.fecha_respuesta = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      }
      
      // Si el estado no es ENVIADO, eliminar fecha_envio
      if (dataToSend.estado !== 'ENVIADO') {
        dataToSend.fecha_envio = null;
      }
      
      // Si el estado no es RESPONDIDO, eliminar fecha_respuesta
      if (dataToSend.estado !== 'RESPONDIDO') {
        dataToSend.fecha_respuesta = null;
      }
      
      await axios.post('/api/roi-solicitudes', dataToSend);
      setShowModal(false);
      setFormData({
        numero_roi: '',
        municipio_id: '',
        sujeto_pasivo_id: '',
        roi_plantilla_id: '',
        estado: 'BORRADOR',
        fecha_envio: '',
        fecha_respuesta: '',
        es_agente_especial: false
      });
      fetchSolicitudes(); // Recargar la lista
    } catch (err) {
      setError('Error al crear la solicitud ROI');
      console.error('Error creating ROI solicitud:', err);
    }
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
      setSelectedItems(solicitudes.map(s => s.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleEdit = () => {
    if (selectedItems.length === 1) {
      const item = solicitudes.find(s => s.id === selectedItems[0]);
      setEditingItem(item);
      setFormData({
        numero_roi: item.numero_roi,
        municipio_id: item.municipio_id.toString(),
        sujeto_pasivo_id: item.sujeto_pasivo_id.toString(),
        roi_plantilla_id: item.roi_plantilla_id.toString(),
        estado: item.estado,
        fecha_envio: item.fecha_envio || '',
        fecha_respuesta: item.fecha_respuesta || '',
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
      const dataToSend = { ...formData };
      
      // Si el estado es RESPONDIDO y no hay fecha, establecer fecha actual
      if (dataToSend.estado === 'RESPONDIDO' && !dataToSend.fecha_respuesta) {
        dataToSend.fecha_respuesta = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      }
      
      // Si el estado no es ENVIADO, eliminar fecha_envio
      if (dataToSend.estado !== 'ENVIADO') {
        dataToSend.fecha_envio = null;
      }
      
      // Si el estado no es RESPONDIDO, eliminar fecha_respuesta
      if (dataToSend.estado !== 'RESPONDIDO') {
        dataToSend.fecha_respuesta = null;
      }
      
      await axios.put(`/api/roi-solicitudes/${editingItem.id}`, dataToSend);
      setShowEditModal(false);
      setEditingItem(null);
      setFormData({
        numero_roi: '',
        municipio_id: '',
        sujeto_pasivo_id: '',
        roi_plantilla_id: '',
        estado: 'BORRADOR',
        fecha_envio: '',
        fecha_respuesta: '',
        es_agente_especial: false
      });
      setSelectedItems([]);
      fetchSolicitudes();
    } catch (err) {
      setError('Error al actualizar la solicitud ROI');
      console.error('Error updating ROI solicitud:', err);
    }
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      setError('Por favor selecciona al menos un elemento para eliminar');
      return;
    }
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedItems.length} solicitud(es)?`)) {
      try {
        await Promise.all(
          selectedItems.map(id => axios.delete(`/api/roi-solicitudes/${id}`))
        );
        setSelectedItems([]);
        fetchSolicitudes();
      } catch (err) {
        setError('Error al eliminar las solicitudes ROI');
        console.error('Error deleting ROI solicitudes:', err);
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
            <h1>ROI Solicitudes</h1>
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
                Nueva Solicitud ROI
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
                          checked={selectedItems.length === solicitudes.length && solicitudes.length > 0}
                        />
                      </th>
                    )}
                    <th>Número ROI</th>
                    <th>Municipio</th>
                    <th>Sujeto Pasivo</th>
                    <th>Plantilla</th>
                    <th>Estado</th>
                    <th>Fecha Envío</th>
                    <th>Fecha Respondido</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((solicitud) => (
                    <tr key={solicitud.id}>
                      {showCheckboxes && (
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedItems.includes(solicitud.id)}
                            onChange={() => handleSelectItem(solicitud.id)}
                          />
                        </td>
                      )}
                      <td>{solicitud.numero_roi}</td>
                      <td>{solicitud.municipio_nombre}</td>
                      <td>{solicitud.sujeto_pasivo_nombre}</td>
                      <td>{solicitud.plantilla_nombre}</td>
                      <td>
                        <span className={`badge ${
                          solicitud.estado === 'ENVIADO' ? 'bg-success' :
                          solicitud.estado === 'BORRADOR' ? 'bg-warning' :
                          solicitud.estado === 'RESPONDIDO' ? 'bg-danger' :
                          'bg-secondary'
                        }`}>
                          {solicitud.estado}
                        </span>
                      </td>
                      <td>{solicitud.fecha_envio ? new Date(solicitud.fecha_envio).toLocaleDateString() : '-'}</td>
                      <td>
                        {solicitud.estado === 'RESPONDIDO' && solicitud.fecha_respuesta 
                          ? new Date(solicitud.fecha_respuesta).toLocaleDateString() 
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para Nueva Solicitud ROI */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Solicitud ROI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Número ROI</Form.Label>
              <Form.Control
                type="text"
                name="numero_roi"
                value={formData.numero_roi}
                onChange={handleInputChange}
                placeholder="Ej: ROI-2024-005"
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
                <option value="">Selecciona un municipio</option>
                {municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.id}>
                    {municipio.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sujeto Pasivo</Form.Label>
              <Form.Select
                name="sujeto_pasivo_id"
                value={formData.sujeto_pasivo_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un sujeto pasivo</option>
                {sujetosPasivos.map((sujeto) => (
                  <option key={sujeto.id} value={sujeto.id}>
                    {sujeto.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Plantilla ROI</Form.Label>
              <Form.Select
                name="roi_plantilla_id"
                value={formData.roi_plantilla_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una plantilla</option>
                {plantillas.map((plantilla) => (
                  <option key={plantilla.id} value={plantilla.id}>
                    {plantilla.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
              >
                <option value="BORRADOR">BORRADOR</option>
                <option value="ENVIADO">ENVIADO</option>
                <option value="RESPONDIDO">RESPONDIDO</option>
              </Form.Select>
            </Form.Group>

            {formData.estado === 'ENVIADO' && (
              <Form.Group className="mb-3">
                <Form.Label>Fecha Envío</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_envio"
                  value={formData.fecha_envio}
                  onChange={handleInputChange}
                  required={formData.estado === 'ENVIADO'}
                />
              </Form.Group>
            )}

            {formData.estado === 'RESPONDIDO' && (
              <Form.Group className="mb-3">
                <Form.Label>Fecha Respuesta</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_respuesta"
                  value={formData.fecha_respuesta || ''}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Crear Solicitud
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Editar Solicitud ROI */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Solicitud ROI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Número ROI</Form.Label>
              <Form.Control
                type="text"
                name="numero_roi"
                value={formData.numero_roi}
                onChange={handleInputChange}
                placeholder="Ej: ROI-2024-005"
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
                <option value="">Selecciona un municipio</option>
                {municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.id}>
                    {municipio.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sujeto Pasivo</Form.Label>
              <Form.Select
                name="sujeto_pasivo_id"
                value={formData.sujeto_pasivo_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un sujeto pasivo</option>
                {sujetosPasivos.map((sujeto) => (
                  <option key={sujeto.id} value={sujeto.id}>
                    {sujeto.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Plantilla ROI</Form.Label>
              <Form.Select
                name="roi_plantilla_id"
                value={formData.roi_plantilla_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una plantilla</option>
                {plantillas.map((plantilla) => (
                  <option key={plantilla.id} value={plantilla.id}>
                    {plantilla.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
              >
                <option value="BORRADOR">BORRADOR</option>
                <option value="ENVIADO">ENVIADO</option>
                <option value="RESPONDIDO">RESPONDIDO</option>
              </Form.Select>
            </Form.Group>

            {formData.estado === 'ENVIADO' && (
              <Form.Group className="mb-3">
                <Form.Label>Fecha Envío</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_envio"
                  value={formData.fecha_envio}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}

            {formData.estado === 'RESPONDIDO' && (
              <Form.Group className="mb-3">
                <Form.Label>Fecha Respuesta</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_respuesta"
                  value={formData.fecha_respuesta || ''}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}

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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Actualizar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ROISolicitudes;
