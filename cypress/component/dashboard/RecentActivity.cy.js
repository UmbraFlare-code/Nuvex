describe('RecentActivity Component', () => {
  beforeEach(() => {
    const activities = [
      { id: 1, type: 'venta', description: 'Venta #1234', amount: 1500, date: '2023-10-10' },
      { id: 2, type: 'stock', description: 'Actualización stock', amount: null, date: '2023-10-09' },
      { id: 3, type: 'usuario', description: 'Nuevo usuario', amount: null, date: '2023-10-08' }
    ]
    
    cy.mount(<RecentActivity activities={activities} />)
  })

  it('debería mostrar la lista de actividades recientes', () => {
    cy.get('[data-cy=activity-item]').should('have.length', 3)
  })

  it('debería mostrar los detalles de cada actividad', () => {
    cy.get('[data-cy=activity-item]').first().should('contain', 'Venta #1234')
    cy.get('[data-cy=activity-item]').first().should('contain', '1500')
    cy.get('[data-cy=activity-item]').first().should('contain', '2023-10-10')
  })

  it('debería mostrar iconos diferentes según el tipo de actividad', () => {
    cy.get('[data-cy=activity-item]').eq(0).find('[data-cy=icon-venta]').should('exist')
    cy.get('[data-cy=activity-item]').eq(1).find('[data-cy=icon-stock]').should('exist')
    cy.get('[data-cy=activity-item]').eq(2).find('[data-cy=icon-usuario]').should('exist')
  })
})