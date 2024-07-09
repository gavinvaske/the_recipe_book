describe('Quote Views', () => {
  const formUrlPrefix = '/react-ui/forms';

  before(() => {
    cy.login();
  });

  it('Should render the Quote form', () => {
      cy.visit(`${formUrlPrefix}/quote`);

      cy.get('[data-test=quote-form]').should('exist');
  });
});