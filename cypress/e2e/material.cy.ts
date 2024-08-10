describe('Material Views', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Should render the Material form', () => {
      cy.visit(`/react-ui/forms/material`);

      cy.get('[data-test=material-form]').should('exist');
  });

  it('Should render the Material table and searchbar', () => {
    cy.visit(`/react-ui/tables/material`);

    cy.get('#material-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
  });
});