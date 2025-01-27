describe('CreditTerm Views', () => {
  const formUrlPrefix = '/react-ui/forms';
  const tableUrlPrefix = '/react-ui/tables';

  beforeEach(() => {
    cy.login();
  });

  it('Should render the CreditTerm form', () => {
    const url = `${formUrlPrefix}/credit-term`;
    cy.visit(url);

    cy.get('[data-test=credit-term-form]').should('exist');
    cy.url().should('include', url)
  });

  it('Should render the CreditTerm table and searchbar', () => {
    const url = `${tableUrlPrefix}/credit-term`;
    cy.visit(url);

    cy.get('#credit-term-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
    cy.url().should('include', url)
  });
});