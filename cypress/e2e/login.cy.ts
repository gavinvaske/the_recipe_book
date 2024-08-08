describe('UI Test cases', () => {
    it('Unauthenticated user should see the login page', () => {
        cy.visit('/react-ui/inventory');

        cy.contains('Login');
    });

    it('User should see their dashboard upon login', () => {
      cy.login();

      cy.contains('Account Settings');
  });
});