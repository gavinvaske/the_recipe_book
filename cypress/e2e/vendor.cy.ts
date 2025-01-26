describe('Vendor Views', () => {
    beforeEach(() => {
      cy.login();
    });
  
    it('Should render the Vendor form', () => {
        cy.visit(`/react-ui/forms/vendor`);
  
        cy.get('[data-test=vendor-form]').should('exist');
    });
  
    it('Should render the Vendor table and searchbar', () => {
      cy.visit(`/react-ui/tables/vendor`);
  
      cy.get('#vendor-table').should('exist');
      cy.get('[data-test=searchbar]').should('exist');
    });
  });