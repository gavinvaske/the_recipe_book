describe('MaterialCategory Views', () => {
  const formUrlPrefix = '/react-ui/forms'
  const tableUrlPrefix = '/react-ui/tables'

  beforeEach(() => {
    cy.login();
  });

  it('Should render the MategoryCategory form', () => {
    const url = `${formUrlPrefix}/material-category`;

    cy.visit(url);

    cy.get('[data-test=material-category-form]').should('exist');
    cy.url().should('include', url)
  });

  it('Should render the MaterialCategory table and searchbar', () => {
    const url = `${tableUrlPrefix}/material-category`;

    cy.visit(url);

    cy.get('#material-category-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
    cy.url().should('include', url)
  });
});