// cypress/support/commands.js

// Ejemplo: comando para login con credenciales
Cypress.Commands.add("login", (email, password) => {
  cy.visit("/login")
  cy.get("input#email").type(email)
  cy.get("input#password").type(password)
  cy.get("button#login-submit").click()
})

// Ejemplo: comando para registrar usuario
Cypress.Commands.add("register", (name, email, password) => {
  cy.visit("/login")
  cy.contains("Solicitar Registro").click()
  cy.get("input#name").type(name)
  cy.get("input#reg-email").type(email)
  cy.get("input#reg-password").type(password)
  cy.get("button[type='submit']").click()
})

// Ejemplo: comando para mockear API de login
Cypress.Commands.add("mockLoginAPI", (status = 200, body = { message: "ok" }) => {
  cy.intercept("POST", "/api/auth/login", {
    statusCode: status,
    body,
  }).as("loginRequest")
})

// Sobrescribe el tipo de comando si usas TypeScript (cypress.d.ts)
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       register(name: string, email: string, password: string): Chainable<void>
//       mockLoginAPI(status?: number, body?: object): Chainable<void>
//     }
//   }
// }
