describe('Login Component', () => {
  beforeEach(() => {
    cy.visit('/') // Ajustar si login está en /login
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
    cy.get('.error').should('be.visible')
  })

  it('cambia al formulario de registro al pulsar el tab', () => {
    cy.contains('Solicitar Registro').click()
    cy.get('#name').should('exist')
    cy.get('#reg-email').should('exist')
    cy.get('#reg-password').should('exist')
  })

  it('permite registro con datos válidos', () => {
    cy.contains('Solicitar Registro').click()
    cy.get('#name').type('Test User')
    cy.get('#reg-email').type('newuser@test.com')
    cy.get('#reg-password').type('password123')
    cy.get('form').submit()
    cy.get('.success', { timeout: 5000 }).should('be.visible')
  })

  it('muestra credenciales demo solo en login', () => {
    cy.get('.demoCredentials').should('exist')
    cy.contains('Solicitar Registro').click()
    cy.get('.demoCredentials').should('not.exist')
  })
})
