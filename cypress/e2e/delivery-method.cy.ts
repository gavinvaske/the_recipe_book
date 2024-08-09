describe('DeliveryMethod Views', () => {
  const formUrlPrefix = '/react-ui/forms';
  const tableUrlPrefix = '/react-ui/tables';

  beforeEach(() => {
    cy.login();
  });

  it('Should render the DeliveryMethod form', () => {
      cy.visit(`${formUrlPrefix}/delivery-method`);

      cy.get('[data-test=delivery-method-form]').should('exist');
  });

  it('Should render the DeliveryMethod table and searchbar', () => {
    cy.visit(`${tableUrlPrefix}/delivery-method`);

    cy.get('#delivery-method-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
  });
});