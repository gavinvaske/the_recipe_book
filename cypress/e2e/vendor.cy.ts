describe('Vendor Views', () => {
  const formUrlPrefix = '/react-ui/forms';
  const tableUrlPrefix = '/react-ui/tables';

  beforeEach(() => {
    cy.login();
  });

  it('Should render the Vendor form', () => {
    const url = `${formUrlPrefix}/vendor`;

    cy.visit(url);

    cy.get('[data-test=vendor-form]').should('exist');
    cy.url().should('include', url)
  });

  it('Should render the Vendor table and searchbar', () => {
    const url = `${tableUrlPrefix}/vendor`;

    cy.visit(url);

    cy.get('#vendor-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
    cy.url().should('include', url)
  });
});