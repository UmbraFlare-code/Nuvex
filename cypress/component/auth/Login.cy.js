describe('Login Component', () => {
  beforeEach(() => {
    cy.mount(<Login />)
  })

  it('debería mostrar el formulario de login', () => {
    cy.get('[data-cy=email]').should('exist')
    cy.get('[data-cy=password]').should('exist')
    cy.get('[data-cy=submit]').should('exist')
  })

  it('debería validar campos vacíos', () => {
    cy.get('[data-cy=submit]').click()
    cy.get('[data-cy=error-message]').should('be.visible')
  })

  it('debería permitir ingresar credenciales', () => {
    cy.get('[data-cy=email]').type('test@example.com')
    cy.get('[data-cy=password]').type('password123')
    cy.get('[data-cy=email]').should('have.value', 'test@example.com')
    cy.get('[data-cy=password]').should('have.value', 'password123')
  })
})