describe('AdhesiveCategory Views', () => {
  const formUrlPrefix = '/react-ui/forms';

  before(() => {
    cy.login();
  });

  it('Should render the AdhesiveCategory form', () => {
      cy.visit(`${formUrlPrefix}/adhesive-category`);

      cy.get('[data-test=adhesive-category-form]').should('exist');
  });
});