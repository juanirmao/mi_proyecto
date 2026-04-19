import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <LinkContainer to="/">
          <Navbar.Brand>Proyecto Cartera</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/municipios">
              <Nav.Link>Municipios</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/sujetos-pasivos">
              <Nav.Link>Sujetos Pasivos</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/roi-solicitudes">
              <Nav.Link>ROI Solicitudes</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/liquidaciones-iap">
              <Nav.Link>Liquidaciones IAP</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/documentos">
              <Nav.Link>Documentos</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;