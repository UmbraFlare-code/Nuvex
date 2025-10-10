describe('UserList Component', () => {
  beforeEach(() => {
    const users = [
      { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'admin' },
      { id: 2, name: 'María López', email: 'maria@example.com', role: 'user' },
      { id: 3, name: 'Carlos Gómez', email: 'carlos@example.com', role: 'user' }
    ]
    
    cy.mount(<UserList users={users} />)
  })

  it('debería mostrar la lista de usuarios', () => {
    cy.get('[data-cy=user-item]').should('have.length', 3)
  })

  it('debería mostrar los detalles de cada usuario', () => {
    cy.get('[data-cy=user-item]').first().should('contain', 'Juan Pérez')
    cy.get('[data-cy=user-item]').first().should('contain', 'admin')
  })

  it('debería tener botones de acción para cada usuario', () => {
    cy.get('[data-cy=user-item]').first().find('[data-cy=btn-edit-user]').should('exist')
    cy.get('[data-cy=user-item]').first().find('[data-cy=btn-delete-user]').should('exist')
  })

  it('debería filtrar usuarios por rol', () => {
    cy.get('[data-cy=filter-role]').select('user')
    cy.get('[data-cy=user-item]').should('have.length', 2)
  })
})