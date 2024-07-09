describe('MaterialLengthAdjustment Views', () => {
  const formUrlPrefix = '/react-ui/forms'

  before(() => {
    cy.login();
  })

  it('Should render the MaterialLengthAdjustment form', () => {
      cy.visit(`${formUrlPrefix}/material-length-adjustment`);

      cy.get('[data-test=material-length-adjustment-form]').should('exist');
  });
});