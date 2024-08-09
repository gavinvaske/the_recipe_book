describe('Inventory Views', () => {
  const inventoryPage = '/react-ui/inventory'

  beforeEach(() => {
    cy.login();
  });

  it('Should render the Inventory page', () => {
      cy.visit(`${inventoryPage}`);

      cy.get('[data-test=inventory-page]').should('exist');
      cy.get('[data-test=material-inventory-card]').should('have.length.greaterThan', 0)
  });
});