Cypress.Commands.add('login', (username, password) => {
  cy.visit('/react-ui/login')

  if (!Cypress.env('loginUsername') && !username) throw new Error('Missing a required cypress environment variable: "loginUsername"')
  if (!Cypress.env('loginPassword') && !password) throw new Error('Missing a required cypress environment variable: "loginPassword"')

  /* When username and password input fields are populated */
  cy.get('[data-test=username-input]').type(username ? username : Cypress.env('loginUsername'))
  cy.get('[data-test=password-input]').type(password ? password : Cypress.env('loginPassword'))

  /* And a User clicks login */
  cy.get('[data-test=login-btn]').click();

  cy.contains('TODO Build Home.jsx').should('exist'); /* !! Important !! Without this line, the tests run too quickly and break */
})

Cypress.Commands.add('logout', () => {
  cy.request('/auth/logout'); /* TODO: Initiate logout via a UI button instead of direct HTTP request*/
})

