describe('Sujetos Pasivos Tests - Proyecto Cartera', () => {
  beforeEach(() => {
    // Visit the Sujetos Pasivos page
    cy.visit('http://localhost:3000/sujetos-pasivos');
    
    // Wait for the page to load
    cy.get('.container', { timeout: 10000 }).should('be.visible');
  });

  it('Should display Sujetos Pasivos page with table', () => {
    // Check that the page title is visible
    cy.get('h1').should('contain', 'Sujetos Pasivos');
    
    // Check that the table is present
    cy.get('table').should('be.visible');
    cy.get('table thead').should('be.visible');
    cy.get('table tbody').should('be.visible');
    
    // Check for table headers
    cy.get('table th').should('contain', 'Nombre');
    cy.get('table th').should('contain', 'Tipo');
    cy.get('table th').should('contain', 'NIT');
    cy.get('table th').should('contain', 'Municipio');
  });

  it('Should load sujetos pasivos data correctly', () => {
    // Intercept API calls
    cy.intercept('GET', '/api/sujetos-pasivos').as('getSujetosPasivos');
    cy.intercept('GET', '/api/municipios').as('getMunicipios');
    
    // Wait for API calls to complete
    cy.wait(['@getSujetosPasivos', '@getMunicipios']);
    
    // Verify no error messages are shown
    cy.get('.alert-danger').should('not.exist');
    
    // Verify table has data
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('Should create a new sujeto pasivo', () => {
    // Click the "Nuevo Sujeto Pasivo" button
    cy.get('button').contains('Nuevo Sujeto Pasivo').click();
    
    // Check that modal appears
    cy.get('.modal').should('be.visible');
    cy.get('.modal-title').should('contain', 'Nuevo Sujeto Pasivo');
    
    // Fill out the form
    cy.get('input[name="nombre"]').type('Test Sujeto Cypress');
    cy.get('input[name="tipo"]').type('Comercializadora de Energía');
    cy.get('input[name="nit"]').type('123456789');
    cy.get('select[name="municipio_id"]').select('1'); // Assuming first option
    
    // Check Agente Especial checkbox
    cy.get('input[name="es_agente_especial"]').check();
    
    // Submit the form
    cy.get('button[type="submit"]').contains('Guardar').click();
    
    // Check that modal closes
    cy.get('.modal').should('not.exist');
    
    // Check for success message (if any)
    cy.get('.alert-success', { timeout: 5000 }).should('be.visible');
  });

  it('Should edit an existing sujeto pasivo', () => {
    // Wait for table to load
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    
    // Select the first row
    cy.get('table tbody tr').first().find('input[type="checkbox"]').check();
    
    // Click the "Editar" button
    cy.get('button').contains('Editar').click();
    
    // Check that edit modal appears
    cy.get('.modal').should('be.visible');
    cy.get('.modal-title').should('contain', 'Editar Sujeto Pasivo');
    
    // Verify form is populated
    cy.get('input[name="nombre"]').should('not.be.empty');
    cy.get('input[name="nit"]').should('not.be.empty');
    cy.get('select[name="municipio_id"]').should('have.value', /\d+/);
    
    // Change some values
    cy.get('input[name="nombre"]').clear().type('Updated Sujeto Cypress');
    cy.get('input[name="tipo"]').clear().type('Generadora de Energía');
    
    // Toggle Agente Especial
    cy.get('input[name="es_agente_especial"]').uncheck();
    
    // Submit the form
    cy.get('button').contains('Actualizar').click();
    
    // Check that modal closes
    cy.get('.modal').should('not.exist');
  });

  it('Should delete a sujeto pasivo', () => {
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
      
      // Check that modal closes
      cy.get('.modal').should('not.exist');
    });
  });

  it('Should display Agente Especial status correctly', () => {
    // Wait for table to load
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    
    // Check if Agente Especial column exists
    cy.get('table th').then(($headers) => {
      const hasAgenteEspecialColumn = Array.from($headers).some(header => 
        header.textContent.includes('Agente Especial')
      );
      
      if (hasAgenteEspecialColumn) {
        // Check that Agente Especial values are displayed correctly
        cy.get('table tbody tr').each(($row) => {
          cy.wrap($row).find('td').should('contain.text', /^(Sí|No|true|false)$/);
        });
      }
    });
  });

  it('Should validate form inputs', () => {
    // Click the "Nuevo Sujeto Pasivo" button
    cy.get('button').contains('Nuevo Sujeto Pasivo').click();
    
    // Try to submit empty form
    cy.get('button[type="submit"]').contains('Guardar').click();
    
    // Check for validation errors
    cy.get('input:invalid').should('have.length.greaterThan', 0);
    
    // Fill required fields
    cy.get('input[name="nombre"]').type('Test Sujeto');
    cy.get('input[name="nit"]').type('123456789');
    cy.get('select[name="municipio_id"]').select('1');
    
    // Now form should be valid
    cy.get('button[type="submit"]').contains('Guardar').click();
    cy.get('.modal').should('not.exist');
  });

  it('Should handle duplicate NIT validation', () => {
    // Click the "Nuevo Sujeto Pasivo" button
    cy.get('button').contains('Nuevo Sujeto Pasivo').click();
    
    // Use an existing NIT (this would need to be adjusted based on actual data)
    cy.get('input[name="nombre"]').type('Duplicate Test');
    cy.get('input[name="nit"]').type('123456789'); // Assuming this exists
    cy.get('select[name="municipio_id"]').select('1');
    
    // Submit the form
    cy.get('button[type="submit"]').contains('Guardar').click();
    
    // Check for duplicate error message
    cy.get('.alert-danger', { timeout: 5000 }).then(($alert) => {
      if ($alert.length > 0) {
        cy.wrap($alert).should('contain', 'duplicate');
      }
    });
  });
});
