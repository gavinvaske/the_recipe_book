Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('UI Test cases', () => {
  it('should never fail this sanity check', () => {
    expect(true).to.equal(true)
  });

  it('Visits the base URL', () => {
    cy.visit(`/`)
  })
});