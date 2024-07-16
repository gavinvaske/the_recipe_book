describe('Customer Views', () => {
  const formUrlPrefix = '/react-ui/forms'
  const tableUrlPrefix = '/react-ui/tables'

  before(() => {
    cy.login();
  })

  it('Should render the Customer form', () => {
      cy.visit(`${formUrlPrefix}/customer`);

      cy.get('[data-test=customer-form]').should('exist');
  });

  it('Should render the Customer table and searchbar', () => {
    cy.visit(`${tableUrlPrefix}/customer`);

    cy.get('#customer-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
  });
});