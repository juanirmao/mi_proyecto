describe('Dashboard Tests - Proyecto Cartera', () => {
  beforeEach(() => {
    // Visit the dashboard page
    cy.visit('http://localhost:3000/dashboard');
    
    // Wait for the page to load
    cy.get('.container', { timeout: 10000 }).should('be.visible');
  });

  it('Should display dashboard with statistics cards', () => {
    // Check that the dashboard title is visible
    cy.get('h1').should('contain', 'Dashboard');
    
    // Check that statistics cards are present
    cy.get('.card').should('have.length.greaterThan', 0);
    
    // Check for main statistics
    cy.contains('Municipios').should('be.visible');
    cy.contains('Sujetos Pasivos').should('be.visible');
    cy.contains('ROI Solicitudes').should('be.visible');
    
    // Verify that statistics are numbers
    cy.get('.card').each(($card) => {
      cy.wrap($card).find('.card-body').should('contain.text', /^\d+$/);
    });
  });

  it('Should load statistics data correctly', () => {
    // Wait for data to load
    cy.intercept('GET', '/api/municipios').as('getMunicipios');
    cy.intercept('GET', '/api/sujetos-pasivos').as('getSujetosPasivos');
    cy.intercept('GET', '/api/roi-solicitudes').as('getRoiSolicitudes');
    
    // Wait for API calls to complete
    cy.wait(['@getMunicipios', '@getSujetosPasivos', '@getRoiSolicitudes']);
    
    // Verify no error messages are shown
    cy.get('.alert-danger').should('not.exist');
    
    // Verify loading is complete
    cy.get('.spinner-border').should('not.exist');
  });

  it('Should handle API errors gracefully', () => {
    // Simulate API failure
    cy.intercept('GET', '/api/municipios', { forceNetworkError: true }).as('municipiosError');
    cy.intercept('GET', '/api/sujetos-pasivos', { forceNetworkError: true }).as('sujetosError');
    cy.intercept('GET', '/api/roi-solicitudes', { forceNetworkError: true }).as('roiError');
    
    // Reload page to trigger error
    cy.reload();
    
    // Wait for error to occur
    cy.wait(['@municipiosError', '@sujetosError', '@roiError']);
    
    // Check that error message is displayed
    cy.get('.alert-danger', { timeout: 5000 }).should('be.visible');
    cy.get('.alert-danger').should('contain.text', 'Error al cargar las estadísticas');
  });

  it('Should have responsive design', () => {
    // Test desktop view
    cy.viewport(1280, 720);
    cy.get('.container').should('be.visible');
    cy.get('.row').should('be.visible');
    
    // Test tablet view
    cy.viewport(768, 1024);
    cy.get('.container').should('be.visible');
    
    // Test mobile view
    cy.viewport(375, 667);
    cy.get('.container').should('be.visible');
    cy.get('.card').should('be.visible');
  });

  it('Should navigate to different sections', () => {
    // Check navigation links exist
    cy.get('nav').should('be.visible');
    
    // Test navigation to Municipios (if link exists)
    cy.get('nav').contains('Municipios').then(($link) => {
      if ($link.length > 0) {
        cy.wrap($link).click();
        cy.url().should('include', '/municipios');
      }
    });
    
    // Go back to dashboard
    cy.visit('http://localhost:3000/dashboard');
    
    // Test navigation to Sujetos Pasivos (if link exists)
    cy.get('nav').contains('Sujetos Pasivos').then(($link) => {
      if ($link.length > 0) {
        cy.wrap($link).click();
        cy.url().should('include', '/sujetos-pasivos');
      }
    });
  });
});
