describe('My First Test', () => {
  it('should never fail this sanity check', () => {
    expect(true).to.equal(true)
  });

  it('Visits the Kitchen Sink', () => {
    cy.visit('https://example.cypress.io')
  })

  it('Visits the Kitchen Sink', () => {
    cy.visit('http://localhost:8080/')
  })
});