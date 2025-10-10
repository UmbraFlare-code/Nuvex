describe('DashboardStats Component', () => {
  beforeEach(() => {
    const stats = {
      totalProductos: 150,
      stockBajo: 12,
      ventasMes: 45000,
      pedidosPendientes: 8
    }
    
    cy.mount(<DashboardStats stats={stats} />)
  })

  it('debería mostrar todas las estadísticas correctamente', () => {
    cy.get('[data-cy=stat-total-productos]').should('contain', '150')
    cy.get('[data-cy=stat-stock-bajo]').should('contain', '12')
    cy.get('[data-cy=stat-ventas-mes]').should('contain', '45000')
    cy.get('[data-cy=stat-pedidos-pendientes]').should('contain', '8')
  })

  it('debería mostrar alertas para stock bajo', () => {
    cy.get('[data-cy=alerta-stock-bajo]').should('exist')
    cy.get('[data-cy=alerta-stock-bajo]').should('have.class', 'warning')
  })
})