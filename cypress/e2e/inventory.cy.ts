describe('Inventory Views', () => {
  const inventoryPage = '/react-ui/inventory'

  before(() => {
    cy.login();
  })

  it('Should render the Inventory page', () => {
      cy.visit(`${inventoryPage}`);

      cy.get('[data-test=inventory-page]').should('exist');
  });
});