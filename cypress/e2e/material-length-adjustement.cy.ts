describe('MaterialLengthAdjustment Views', () => {
  const formUrlPrefix = '/react-ui/forms'

  beforeEach(() => {
    cy.login();
  });

  it('Should render the MaterialLengthAdjustment form', () => {
      cy.visit(`${formUrlPrefix}/material-length-adjustment`);

      cy.get('[data-test=material-length-adjustment-form]').should('exist');
  });

  it('Should render the Material Order table and searchbar', () => {
    cy.visit(`/react-ui/tables/material-length-adjustment`);

    cy.get('#material-length-adjustment-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
  });
});