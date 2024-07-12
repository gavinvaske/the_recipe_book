describe('UI Test cases', () => {
    it('Unauthenticated user should see the login page', () => {
        cy.visit('/');

        cy.contains('Please sign in to get started.');
    });

    it('User should see their dashboard upon login', () => {
      cy.login();

      cy.contains('Account Settings');
  });
});