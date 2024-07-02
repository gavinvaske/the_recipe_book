describe('DeliveryMethod Views', () => {
  const formUrlPrefix = '/react-ui/forms';

  before(() => {
    cy.login();
  });

  it('Should render the DeliveryMethod form', () => {
      cy.visit(`${formUrlPrefix}/quote`);

      cy.get('[data-test=quote-form]').should('exist');
  });
});