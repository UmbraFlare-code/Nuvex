// cypress/support/e2e.js

// Importa los comandos personalizados
import './commands'

// Manejo de excepciones no controladas en la app bajo prueba
Cypress.on("uncaught:exception", (err, runnable) => {
  // evita que Cypress falle por errores no críticos de React/Next.js
  return false
})

// Opcional: limpiar cookies y localStorage antes de cada test
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
})
