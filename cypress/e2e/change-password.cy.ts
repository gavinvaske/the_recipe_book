describe('Change Password Test Cases', () => {
  const requiredButIgnoredValue = 'foobar'
  const changePasswordUrl = `/react-ui/change-password/${requiredButIgnoredValue}/${requiredButIgnoredValue}`;

  it('Page should exist and contain the neccessary elements', () => {
    cy.visit(changePasswordUrl);

    cy.get('[data-test=password-input]').should('exist');
    cy.get('[data-test=repeat-password-input]').should('exist');
    cy.get('[data-test=change-password-btn]').should('exist')
  })
})