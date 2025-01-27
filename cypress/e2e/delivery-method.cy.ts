describe('DeliveryMethod Views', () => {
  const formUrlPrefix = '/react-ui/forms';
  const tableUrlPrefix = '/react-ui/tables';

  beforeEach(() => {
    cy.login();
  });

  it('Should render the DeliveryMethod form', () => {
    const url = `${formUrlPrefix}/delivery-method`;

    cy.visit(url);

    cy.get('[data-test=delivery-method-form]').should('exist');
    cy.url().should('include', url)
  });

  it('Should render the DeliveryMethod table and searchbar', () => {
    const url = `${tableUrlPrefix}/delivery-method`;

    cy.visit(url);

    cy.get('#delivery-method-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
    cy.url().should('include', url)
  });
});