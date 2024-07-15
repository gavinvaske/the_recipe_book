describe('AdhesiveCategory Views', () => {
  const formUrlPrefix = '/react-ui/forms';
  const tableUrlPrefix = '/react-ui/tables';

  before(() => {
    cy.login();
  });

  it('Should render the AdhesiveCategory form', () => {
      cy.visit(`${formUrlPrefix}/adhesive-category`);

      cy.get('[data-test=adhesive-category-form]').should('exist');
  });

  it('Should render the CreditTerm table and searchbar', () => {
    cy.visit(`${tableUrlPrefix}/adhesive-category`);

    cy.get('#adhesive-category-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
  });
});