describe('Gestión de Productos', () => {
  beforeEach(() => {
    // Asume login previo y redirección a /productos
    cy.visit('/productos')
  })

  it('permite crear un nuevo producto', () => {
    cy.get('[data-cy=btn-nuevo-producto]').click()

    cy.get('[data-cy=input-nombre]').type('Motor E2E Test')
    cy.get('[data-cy=input-categoria]').select('Motores')
    cy.get('[data-cy=input-precio]').clear().type('500.50')
    cy.get('[data-cy=input-stock]').clear().type('10')
    cy.get('[data-cy=input-minStock]').clear().type('2')
    cy.get('[data-cy=input-descripcion]').type('Producto creado en test E2E')

    cy.get('[data-cy=btn-guardar]').click()

    // Verificar en lista
    cy.get('[data-cy=product-card]').contains('Motor E2E Test')
  })

  it('permite editar un producto existente', () => {
    cy.get('[data-cy=product-card]').contains('Motor E2E Test')
      .parents('[data-cy=product-card]')
      .within(() => {
        cy.get('[data-cy=btn-editar]').click()
      })

    cy.get('[data-cy=input-precio]').clear().type('750.00')
    cy.get('[data-cy=btn-guardar]').click()

    // Validar cambio
    cy.get('[data-cy=product-card]')
      .contains('Motor E2E Test')
      .parents('[data-cy=product-card]')
      .contains('$750.00')
  })

  it('permite eliminar un producto', () => {
    cy.get('[data-cy=product-card]').contains('Motor E2E Test')
      .parents('[data-cy=product-card]')
      .within(() => {
        cy.get('[data-cy=btn-eliminar]').click()
      })

    cy.on('window:confirm', () => true) // aceptar confirmación

    // Verificar que ya no exista
    cy.get('[data-cy=product-card]').should('not.contain', 'Motor E2E Test')
  })

  it('filtra productos desde la barra de búsqueda', () => {
    cy.get('input[aria-label="Buscar productos"]').type('Motor')

    cy.get('[data-cy=product-card]').each(card => {
      cy.wrap(card).contains(/Motor/i)
    })

    cy.get('input[aria-label="Buscar productos"]').clear()
    cy.get('[data-cy=product-card]').its('length').should('be.greaterThan', 0)
  })
})
