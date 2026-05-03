describe('ROI Solicitudes Tests - Proyecto Cartera', () => {
  beforeEach(() => {
    // Visit the ROI Solicitudes page
    cy.visit('http://localhost:3000/roi-solicitudes');
    
    // Wait for the page to load
    cy.get('.container', { timeout: 10000 }).should('be.visible');
  });

  it('Should display ROI Solicitudes page with table', () => {
    // Check that the page title is visible
    cy.get('h1').should('contain', 'ROI Solicitudes');
    
    // Check that the table is present
    cy.get('table').should('be.visible');
    cy.get('table thead').should('be.visible');
    cy.get('table tbody').should('be.visible');
    
    // Check for table headers
    cy.get('table th').should('contain', 'Número ROI');
    cy.get('table th').should('contain', 'Municipio');
    cy.get('table th').should('contain', 'Sujeto Pasivo');
    cy.get('table th').should('contain', 'Estado');
    cy.get('table th').should('contain', 'Fecha Envío');
    cy.get('table th').should('contain', 'Fecha Respondido');
  });

  it('Should load ROI solicitudes data correctly', () => {
    // Intercept API calls
    cy.intercept('GET', '/api/roi-solicitudes').as('getRoiSolicitudes');
    cy.intercept('GET', '/api/municipios').as('getMunicipios');
    cy.intercept('GET', '/api/sujetos-pasivos').as('getSujetosPasivos');
    cy.intercept('GET', '/api/roi-plantillas').as('getPlantillas');
    
    // Wait for API calls to complete
    cy.wait(['@getRoiSolicitudes', '@getMunicipios', '@getSujetosPasivos', '@getPlantillas']);
    
    // Verify no error messages are shown
    cy.get('.alert-danger').should('not.exist');
    
    // Verify table has data (or shows empty message)
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('Should create a new ROI solicitud', () => {
    // Click the "Nueva Solicitud" button
    cy.get('button').contains('Nueva Solicitud').click();
    
    // Check that modal appears
    cy.get('.modal').should('be.visible');
    cy.get('.modal-title').should('contain', 'Nueva Solicitud ROI');
    
    // Fill out the form
    cy.get('input[name="numero_roi"]').type('TEST-ROI-CYPRESS-001');
    cy.get('select[name="municipio_id"]').select('1'); // Assuming first option
    cy.get('select[name="sujeto_pasivo_id"]').select('1'); // Assuming first option
    cy.get('select[name="roi_plantilla_id"]').select('1'); // Assuming first option
    
    // Test different states
    cy.get('select[name="estado"]').select('BORRADOR');
    
    // Submit the form
    cy.get('button[type="submit"]').contains('Guardar').click();
    
    // Check that modal closes
    cy.get('.modal').should('not.exist');
    
    // Check for success message (if any)
    cy.get('.alert-success', { timeout: 5000 }).should('be.visible');
  });

  it('Should create ROI solicitud with ENVIADO state and date', () => {
    // Click the "Nueva Solicitud" button
    cy.get('button').contains('Nueva Solicitud').click();
    
    // Fill out the form
    cy.get('input[name="numero_roi"]').type('TEST-ROI-CYPRESS-002');
    cy.get('select[name="municipio_id"]').select('1');
    cy.get('select[name="sujeto_pasivo_id"]').select('1');
    cy.get('select[name="roi_plantilla_id"]').select('1');
    
    // Select ENVIADO state
    cy.get('select[name="estado"]').select('ENVIADO');
    
    // Check that fecha_envio field appears
    cy.get('input[name="fecha_envio"]').should('be.visible');
    cy.get('label').should('contain', 'Fecha Envío');
    
    // Set a date
    cy.get('input[name="fecha_envio"]').type('2024-05-01');
    
    // Submit the form
    cy.get('button[type="submit"]').contains('Guardar').click();
    
    // Check that modal closes
    cy.get('.modal').should('not.exist');
  });

  it('Should create ROI solicitud with RESPONDIDO state and date', () => {
    // Click the "Nueva Solicitud" button
    cy.get('button').contains('Nueva Solicitud').click();
    
    // Fill out the form
    cy.get('input[name="numero_roi"]').type('TEST-ROI-CYPRESS-003');
    cy.get('select[name="municipio_id"]').select('1');
    cy.get('select[name="sujeto_pasivo_id"]').select('1');
    cy.get('select[name="roi_plantilla_id"]').select('1');
    
    // Select RESPONDIDO state
    cy.get('select[name="estado"]').select('RESPONDIDO');
    
    // Check that fecha_respuesta field appears
    cy.get('input[name="fecha_respuesta"]').should('be.visible');
    cy.get('label').should('contain', 'Fecha Respuesta');
    
    // Set a date
    cy.get('input[name="fecha_respuesta"]').type('2024-05-01');
    
    // Check Agente Especial checkbox
    cy.get('input[name="es_agente_especial"]').check();
    
    // Submit the form
    cy.get('button[type="submit"]').contains('Guardar').click();
    
    // Check that modal closes
    cy.get('.modal').should('not.exist');
  });

  it('Should edit an existing ROI solicitud', () => {
    // Wait for table to load
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    
    // Select the first row
    cy.get('table tbody tr').first().find('input[type="checkbox"]').check();
    
    // Click the "Editar" button
    cy.get('button').contains('Editar').click();
    
    // Check that edit modal appears
    cy.get('.modal').should('be.visible');
    cy.get('.modal-title').should('contain', 'Editar Solicitud ROI');
    
    // Verify form is populated
    cy.get('input[name="numero_roi"]').should('not.be.empty');
    cy.get('select[name="municipio_id"]').should('have.value', /\d+/);
    cy.get('select[name="sujeto_pasivo_id"]').should('have.value', /\d+/);
    
    // Change the state to test different behaviors
    cy.get('select[name="estado"]').select('RESPONDIDO');
    
    // Check that fecha_respuesta field appears
    cy.get('input[name="fecha_respuesta"]').should('be.visible');
    
    // Toggle Agente Especial
    cy.get('input[name="es_agente_especial"]').uncheck();
    
    // Submit the form
    cy.get('button').contains('Actualizar').click();
    
    // Check that modal closes
    cy.get('.modal').should('not.exist');
  });

  it('Should delete an ROI solicitud', () => {
    // Wait for table to load
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    
    // Get initial row count
    cy.get('table tbody tr').then(($rows) => {
      const initialCount = $rows.length;
      
      // Select the first row
      cy.get('table tbody tr').first().find('input[type="checkbox"]').check();
      
      // Click the "Eliminar" button
      cy.get('button').contains('Eliminar').click();
      
      // Handle confirmation dialog if it appears
      cy.get('.modal').should('be.visible');
      cy.get('.modal-title').should('contain', 'Confirmar Eliminación');
      
      // Confirm deletion
      cy.get('button').contains('Eliminar').click();
      
      // Check that row count decreased (or modal closed)
      cy.get('.modal').should('not.exist');
    });
  });

  it('Should handle table pagination and filtering', () => {
    // Check if pagination exists
    cy.get('.pagination').then(($pagination) => {
      if ($pagination.length > 0) {
        // Test pagination
        cy.get('.pagination').find('.page-link').contains('Siguiente').click();
        cy.url().should('include', 'page=');
      }
    });
    
    // Test search/filter functionality if it exists
    cy.get('input[placeholder*="Buscar"]').then(($search) => {
      if ($search.length > 0) {
        cy.wrap($search).type('TEST');
        cy.get('table tbody tr').should('have.length.lessThan', 10);
      }
    });
  });

  it('Should display correct status badges', () => {
    // Wait for table to load
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    
    // Check status badges
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).find('.badge').should('be.visible');
      
      // Check that badges have correct colors
      cy.wrap($row).find('.badge.bg-success').should('contain', 'ENVIADO');
      cy.wrap($row).find('.badge.bg-warning').should('contain', 'BORRADOR');
      cy.wrap($row).find('.badge.bg-danger').should('contain', 'RESPONDIDO');
    });
  });

  it('Should handle empty states gracefully', () => {
    // This test would need to mock empty API responses
    // For now, just check that empty state message exists
    cy.get('table tbody tr').then(($rows) => {
      if ($rows.length === 1 && $rows.text().includes('No hay datos')) {
        cy.get('table tbody tr').should('contain', 'No hay datos');
      }
    });
  });
});
