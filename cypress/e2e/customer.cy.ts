describe('Customer Views', () => {
  const formUrlPrefix = '/react-ui/forms'
  const tableUrlPrefix = '/react-ui/tables'

  beforeEach(() => {
    cy.login();
  });

  it('Should render the Customer form', () => {
    const url = `${formUrlPrefix}/customer`;

    cy.visit(url);

    cy.get('[data-test=customer-form]').should('exist', 'have.text')
    cy.url().should('include', url)
  });

  it('Should render the Customer table and searchbar', () => {
    const url = `${tableUrlPrefix}/customer`;

    cy.visit(url);

    cy.get('#customer-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
    cy.url().should('include', url)
  });
});