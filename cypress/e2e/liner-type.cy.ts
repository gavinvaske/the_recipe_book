describe('LinerType Views', () => {
  const formUrlPrefix = '/react-ui/forms'
  const tableUrlPrefix = '/react-ui/tables'

  beforeEach(() => {
    cy.login();
  });

  it('Should render the LinerType form', () => {
    const url = `${formUrlPrefix}/liner-type`;

    cy.visit(url);

    cy.get('[data-test=liner-type-form]').should('exist');
    cy.url().should('include', url)
  });

  it('Should render the LinerType table and searchbar', () => {
    const url = `${tableUrlPrefix}/liner-type`;

    cy.visit(url);

    cy.get('#liner-type-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
    cy.url().should('include', url)
  });
});