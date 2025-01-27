describe('AdhesiveCategory Views', () => {
  const formUrlPrefix = '/react-ui/forms';
  const tableUrlPrefix = '/react-ui/tables';

  beforeEach(() => {
    cy.login();
  });

  it('Should render the AdhesiveCategory form', () => {
    const url = `${formUrlPrefix}/adhesive-category`;

    cy.visit(url);

    cy.get('[data-test=adhesive-category-form]').should('exist');
    cy.url().should('include', url)
  });

  it('Should render the AdhesiveCategory table and a searchbar', () => {
    const url = `${tableUrlPrefix}/adhesive-category`;

    cy.visit(url);

    cy.get('#adhesive-category-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
    cy.url().should('include', url)
  });
});