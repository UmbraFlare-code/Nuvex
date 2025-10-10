describe('UserProfile Component', () => {
  beforeEach(() => {
    const user = {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'admin',
      lastLogin: '2023-10-10T15:30:00Z'
    }
    
    cy.mount(<UserProfile user={user} />)
  })

  it('debería mostrar la información del usuario correctamente', () => {
    cy.get('[data-cy=user-name]').should('contain', 'Juan Pérez')
    cy.get('[data-cy=user-email]').should('contain', 'juan@example.com')
    cy.get('[data-cy=user-role]').should('contain', 'admin')
  })

  it('debería mostrar la fecha del último login', () => {
    cy.get('[data-cy=last-login]').should('exist')
  })

  it('debería tener botón para editar perfil', () => {
    cy.get('[data-cy=btn-edit-profile]').should('exist')
    cy.get('[data-cy=btn-edit-profile]').click()
    cy.get('[data-cy=edit-profile-form]').should('be.visible')
  })
})