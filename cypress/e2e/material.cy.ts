describe('Material Views', () => {
  const formUrlPrefix = '/react-ui/forms'
  const tableUrlPrefix = '/react-ui/tables'

  before(() => {
    cy.login();
  })

  it('Should render the Material form', () => {
      cy.visit(`${formUrlPrefix}/material`);

      cy.get('[data-test=material-form]').should('exist');
  });

  it('Should render the Material table', () => {
    cy.visit(`${tableUrlPrefix}/material`);

    cy.get('#material-table').should('exist');
  });
});