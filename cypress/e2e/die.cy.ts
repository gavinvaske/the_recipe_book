describe('Product Views', () => {
  const formUrlPrefix = '/react-ui/forms'
  const tableUrlPrefix = '/react-ui/tables'

  beforeEach(() => {
    cy.login();
  });

  it('Should render the Die form', () => {
      cy.visit(`${formUrlPrefix}/die`);

      cy.get('[data-test=die-form]').should('exist');
  });

  it('Should render the Die table and searchbar', () => {
    cy.visit(`${tableUrlPrefix}/die`);

    cy.get('#die-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
  });
});