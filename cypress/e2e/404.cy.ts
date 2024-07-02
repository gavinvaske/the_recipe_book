describe('404 Page', () => {
  const reactUiPrefix = '/react-ui'
  before(() => {
    cy.login();
  });

  it('Should render a 404 page when an unknown url is requested', () => {
      const unknownUrl = reactUiPrefix + '/foobar/foobar123/foobart/whoknowns987978'

      cy.visit(`${unknownUrl}`);

      cy.get('[data-test=404-page]').should('exist');
  });
});