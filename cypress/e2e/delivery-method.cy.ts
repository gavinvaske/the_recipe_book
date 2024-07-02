describe('Delivery Method Views', () => {
  const formUrlPrefix = '/react-ui/forms'
  const tableUrlPrefix = '/react-ui/tables'

  before(() => {
    cy.login();
  })

  it('Should render delivery-method form', () => {
      cy.visit(`${formUrlPrefix}/delivery-method`);

      cy.get('[data-test=delivery-method-form]').should('exist');
  });

  it('Should render delivery-method table', () => {
    cy.visit(`${tableUrlPrefix}/delivery-method`);

    cy.get('#delivery-method-table').should('exist');
  });
});