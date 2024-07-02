describe('Customer Views', () => {
  const formUrlPrefix = '/react-ui/forms'

  before(() => {
    cy.login();
  })

  it('Should render the Customer form', () => {
      cy.visit(`${formUrlPrefix}/customer`);

      cy.get('[data-test=customer-form]').should('exist');
  });
});