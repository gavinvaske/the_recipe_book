describe('MaterialInventoryEntry Views', () => {
  const formUrlPrefix = '/react-ui/forms'

  before(() => {
    cy.login();
  })

  it('Should render the MaterialInventoryEntry form', () => {
      cy.visit(`${formUrlPrefix}/material-inventory-entry`);

      cy.get('[data-test=material-inventory-entry-form]').should('exist');
  });
});