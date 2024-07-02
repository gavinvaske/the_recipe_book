describe('LinerType Views', () => {
  const formUrlPrefix = '/react-ui/forms'
  const tableUrlPrefix = '/react-ui/tables'

  before(() => {
    cy.login();
  })

  it('Should render the LinerType form', () => {
      cy.visit(`${formUrlPrefix}/liner-type`);

      cy.get('[data-test=liner-type-form]').should('exist');
  });

  it('Should render the LinerType table', () => {
    cy.visit(`${tableUrlPrefix}/liner-type`);

    cy.get('#liner-type-table').should('exist');
  });
});