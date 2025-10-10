describe('ProductoCard Component', () => {
  beforeEach(() => {
    const producto = {
      id: 1,
      nombre: 'Producto Test',
      precio: 100,
      stock: 50,
      categoria: 'Electrónica'
    }
    
    cy.mount(<ProductoCard producto={producto} />)
  })

  it('debería mostrar la información del producto', () => {
    cy.get('[data-cy=producto-nombre]').should('contain', 'Producto Test')
    cy.get('[data-cy=producto-precio]').should('contain', '100')
    cy.get('[data-cy=producto-stock]').should('contain', '50')
  })

  it('debería tener botones de acción', () => {
    cy.get('[data-cy=btn-editar]').should('exist')
    cy.get('[data-cy=btn-eliminar]').should('exist')
  })
})