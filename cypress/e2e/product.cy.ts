describe('Product Views', () => {
  const formUrlPrefix = '/react-ui/forms'
  const tableUrlPrefix = '/react-ui/tables'

  beforeEach(() => {
    cy.login();
  });

  it('Should render the Product form', () => {
      cy.visit(`${formUrlPrefix}/products`);

      cy.get('[data-test=product-form]').should('exist');
  });

  it('Should render the Product table and searchbar', () => {
    cy.visit(`${tableUrlPrefix}/products`);

    cy.get('#product-table').should('exist');
    cy.get('[data-test=searchbar]').should('exist');
  });
});