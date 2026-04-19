import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    municipios: 0,
    sujetosPasivos: 0,
    roiSolicitudes: 0,
    liquidaciones: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [municipiosRes, sujetosRes, roiRes, liquidacionesRes] = await Promise.all([
          axios.get('/api/municipios'),
          axios.get('/api/sujetos-pasivos'),
          axios.get('/api/roi-solicitudes'),
          axios.get('/api/liquidaciones-iap') // This endpoint doesn't exist yet, but we'll add it
        ]);

        setStats({
          municipios: municipiosRes.data.length,
          sujetosPasivos: sujetosRes.data.length,
          roiSolicitudes: roiRes.data.length,
          liquidaciones: liquidacionesRes.data?.length || 0
        });
      } catch (err) {
        setError('Error al cargar las estadísticas');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
          <h1>Dashboard - Proyecto Cartera</h1>
          <p className="text-muted">Sistema de Gestión de ROI y Agentes Especiales</p>
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
        <Col md={3} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Municipios</Card.Title>
              <h2 className="text-primary">{stats.municipios}</h2>
              <Card.Text>Municipios registrados en el sistema</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Sujetos Pasivos</Card.Title>
              <h2 className="text-success">{stats.sujetosPasivos}</h2>
              <Card.Text>Posibles agentes especiales identificados</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>ROI Solicitudes</Card.Title>
              <h2 className="text-warning">{stats.roiSolicitudes}</h2>
              <Card.Text>Solicitudes de información enviadas</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Liquidaciones IAP</Card.Title>
              <h2 className="text-info">{stats.liquidaciones}</h2>
              <Card.Text>Liquidaciones del Impuesto de Alumbrado Público</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>Información del Sistema</h5>
            </Card.Header>
            <Card.Body>
              <p>
                Este sistema permite gestionar el proceso completo de identificación de agentes especiales,
                envío de ROI (Requerimiento Ordinario de Información), procesamiento de respuestas y
                generación de liquidaciones del IAP (Impuesto de Alumbrado Público).
              </p>
              <p>
                Funcionalidades principales:
              </p>
              <ul>
                <li>Gestión de municipios y sujetos pasivos</li>
                <li>Creación y envío de solicitudes ROI</li>
                <li>Procesamiento de respuestas en PDF</li>
                <li>Conversión de documentos a formatos editables</li>
                <li>Generación automática de liquidaciones IAP</li>
                <li>Gestión de correspondencia y documentos</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;