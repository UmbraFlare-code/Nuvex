describe("Login + Sidebar Navegación (Admin)", () => {
  beforeEach(() => {
    cy.visit("/login")
  })

  it("permite login como administrador y navegar por el Sidebar", () => {
    cy.fixture("users").then((users) => {
      // 🔑 Login con admin
      cy.get("#email").type(users.admin.email)
      cy.get("#password").type(users.admin.password)
      cy.get("#login-submit").click()

      // ✅ Redirección a dashboard
      cy.url({ timeout: 10000 }).should("include", "/?view=dashboard")

      // ✅ Sidebar visible
      cy.get("aside").should("be.visible")

      // --- 🔎 Recorrer cada sección del sidebar ---
      const menuItems = [
        { label: "Dashboard", path: "/?view=dashboard" },
        { label: "Productos", path: "/?view=products" },
        { label: "Notas", path: "/?view=notes" },
        { label: "Reportes", path: "/?view=reports" },
        { label: "Solicitudes", path: "/?view=requests" },
        { label: "Usuarios", path: "/?view=users" } // 👈 solo admin
      ]

      menuItems.forEach((item) => {
        cy.contains("button, a", item.label, { timeout: 5000 }).click()
        cy.url().should("include", item.path)
        cy.wait(500) // breve espera para evitar race conditions
      })
    })
  })
})
