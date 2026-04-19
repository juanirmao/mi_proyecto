import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

const LiquidacionesIAP = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Liquidaciones IAP</h1>
          <p className="text-muted">Gestión de liquidaciones del Impuesto de Alumbrado Público</p>
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
                  <li>Generar liquidaciones automáticas basadas en acuerdos municipales</li>
                  <li>Calcular valores del IAP por año</li>
                  <li>Gestionar invitaciones a pago</li>
                  <li>Seguimiento de estados de pago</li>
                </ul>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LiquidacionesIAP;