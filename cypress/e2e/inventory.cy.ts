describe('Inventory Views', () => {
  const inventoryPage = '/react-ui/inventory'

  before(() => {
    cy.login();
  })

  it.only('Should render the Inventory page', () => {
      cy.visit(`${inventoryPage}`);

      cy.get('[data-test=inventory-page]').should('exist'); /* Should see the page */
      cy.get('.card').should('have.length.greaterThan', 0)  /* Should have at least 1 material on the page */
  });
});