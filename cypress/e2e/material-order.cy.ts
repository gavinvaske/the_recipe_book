describe('Material Order Views', () => {
  const formUrlPrefix = '/react-ui/forms'
  const tableUrlPrefix = '/react-ui/tables'

  beforeEach(() => {
    cy.login();
  });

  it('Should render the Material Order form', () => {
      cy.visit(`${formUrlPrefix}/material-order`);

      cy.get('[data-test=material-order-form]').should('exist');
  });

  it('Should render the Material Order table and searchbar', () => {
    cy.visit(`${tableUrlPrefix}/material-order`);

    cy.get('#material-order-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
  });
});