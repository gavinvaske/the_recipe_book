describe('Material Views', () => {
  const formUrlPrefix = '/react-ui/forms';
  const tableUrlPrefix = '/react-ui/tables';

  beforeEach(() => {
    cy.login();
  });

  it('Should render the Material form', () => {
    const url = `${formUrlPrefix}/material`;

    cy.visit(url);

    cy.get('[data-test=material-form]').should('exist');
    cy.url().should('include', url)
  });

  it('Should render the Material table and searchbar', () => {
    const url = `${tableUrlPrefix}/material`;

    cy.visit(url);

    cy.get('#material-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
    cy.url().should('include', url)
  });
});