import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

const Documentos = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Gestión de Documentos</h1>
          <p className="text-muted">Conversión y gestión de documentos PDF, Word y Excel</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Alert variant="info">
                <h5>Módulo en desarrollo</h5>
                <p>Esta funcionalidad estará disponible próximamente. Permitirá:</p>
                <ul>
                  <li>Convertir respuestas PDF a formatos editables (Word/Excel)</li>
                  <li>Gestión de archivos adjuntos a correspondencia</li>
                  <li>Procesamiento automático de documentos</li>
                  <li>Enlace de documentos con ROI y liquidaciones</li>
                </ul>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Documentos;