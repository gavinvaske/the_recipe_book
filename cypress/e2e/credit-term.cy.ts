describe('CreditTerm Views', () => {
  const formUrlPrefix = '/react-ui/forms';
  const tableUrlPrefix = '/react-ui/tables';

  beforeEach(() => {
    cy.login();
  });

  it('Should render the CreditTerm form', () => {
      cy.visit(`${formUrlPrefix}/credit-term`);

      cy.get('[data-test=credit-term-form]').should('exist');
  });

  it('Should render the CreditTerm table and searchbar', () => {
    cy.visit(`${tableUrlPrefix}/credit-term`);

    cy.get('#credit-term-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
  });
});