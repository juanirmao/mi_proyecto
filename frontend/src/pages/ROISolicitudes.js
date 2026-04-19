import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ROISolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const response = await axios.get('/api/roi-solicitudes');
      setSolicitudes(response.data);
    } catch (err) {
      setError('Error al cargar las solicitudes ROI');
      console.error('Error fetching ROI solicitudes:', err);
    } finally {
      setLoading(false);
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
            <Button variant="primary">
              Nueva Solicitud ROI
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
                    <th>Número ROI</th>
                    <th>Municipio</th>
                    <th>Sujeto Pasivo</th>
                    <th>Plantilla</th>
                    <th>Estado</th>
                    <th>Fecha Envío</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((solicitud) => (
                    <tr key={solicitud.id}>
                      <td>{solicitud.numero_roi}</td>
                      <td>{solicitud.municipio_nombre}</td>
                      <td>{solicitud.sujeto_pasivo_nombre}</td>
                      <td>{solicitud.plantilla_nombre}</td>
                      <td>
                        <span className={`badge ${
                          solicitud.estado === 'ENVIADO' ? 'bg-success' :
                          solicitud.estado === 'BORRADOR' ? 'bg-warning' :
                          'bg-secondary'
                        }`}>
                          {solicitud.estado}
                        </span>
                      </td>
                      <td>{solicitud.fecha_envio ? new Date(solicitud.fecha_envio).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ROISolicitudes;