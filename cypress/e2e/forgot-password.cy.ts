describe.only('Reset Password Test Cases', () => {
  const forgotPasswordUrl = '/react-ui/forgot-password';

  it('Login page should have a reset password link that links to the correct page', () => {
    cy.visit('/react-ui/login');

    cy.get('#forgot-password-btn').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.equal(forgotPasswordUrl)
    })
  })

  it('Forgot password page should have an input field and a button', () => {
    cy.visit(forgotPasswordUrl);

    cy.get('[data-test=email-input]').should('exist')
    cy.get('[data-test=reset-password-btn]').should('exist')
  })
})