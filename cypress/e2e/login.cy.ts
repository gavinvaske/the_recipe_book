Cypress.on('uncaught:exception', () => {
    return false;
});

describe('UI Test cases', () => {
    it('should never fail this sanity check', () => {
        expect(true).to.equal(true);
    });

    it('Unauthenticated user should see the login page', () => {
        cy.visit('/');

        cy.contains('Please sign in to get started.');
    });

    it('User should see their dashboard upon login', () => {
      cy.login();

      cy.contains('Account Settings');
  });
});