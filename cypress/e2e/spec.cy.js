Cypress.on('uncaught:exception', () => {
    return false;
});

describe('UI Test cases', () => {
    it('should never fail this sanity check', () => {
        expect(true).to.equal(true);
    });

    it('Visits the base URL', () => {
        cy.visit('/');
    });
});