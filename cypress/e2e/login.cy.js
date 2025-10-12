describe('Login Component', () => {
  beforeEach(() => {
    cy.visit('/') // Ajustar si login está en /login
    cy.contains("button", "Iniciar Sesión").click().click()
  })

  it('renderiza correctamente el formulario de login por defecto', () => {
    cy.contains('Sistema de Inventario').should('be.visible')
    cy.get('#email').should('exist')
    cy.get('#password').should('exist')
    cy.get('#login-submit').should('contain', 'Iniciar Sesión')
  })

  it('permite login con credenciales correctas', () => {
    cy.fixture('users').then(users => {
      cy.get('#email').type(users.admin.email)
      cy.get('#password').type(users.admin.password)
      cy.get('#login-submit').click()
      // Ejemplo: esperar redirección a dashboard
      cy.url({ timeout: 10000 }).should('include', '/?view=dashboard')
    })
  })

  it('muestra error con credenciales inválidas', () => {
    cy.get('#email').type('fake@test.com')
    cy.get('#password').type('wrongpass')
    cy.get('#login-submit').click()
    cy.contains('Credenciales incorrectas o cuenta inactiva').should('be.visible')
 })
})
