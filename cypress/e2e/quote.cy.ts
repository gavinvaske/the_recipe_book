describe('Quote Views', () => {
  const formUrlPrefix = '/react-ui/forms';
  const tableUrlPrefix = '/react-ui/tables';

  beforeEach(() => {
    cy.login();
  });

  it('Should render the Quote form', () => {
      cy.visit(`${formUrlPrefix}/quote`);

      cy.get('[data-test=quote-form]').should('exist');
  });

  it('Should render the Quote table and searchbar', () => {
    cy.visit(`${tableUrlPrefix}/quote`);

    cy.get('#quote-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
  });
});