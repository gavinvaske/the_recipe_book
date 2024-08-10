import { Chance } from 'chance';

const chance = new Chance();

describe('Auth Test Cases', () => {
  it('User should see a home page upon login', () => {
    cy.login();

    cy.location().should(loc => {
      expect(loc.pathname).to.equal('/react-ui')
    })
  })

  it.only('Unauthenticated user should see the login page', () => {
    cy.logout();
    cy.visit('/react-ui/inventory');

    cy.contains('Login');
    cy.location().should(loc => {
      expect(loc.pathname).to.equal('/react-ui/login')
    })
  });

  it('An error message should be shown for invalid login', () => {
    cy.logout();
    cy.invalidLogin();
    const expectedInvalidLoginErrorMessage = 'Invalid username or password'

    cy.location().should(loc => {
      expect(loc.pathname).to.equal('/react-ui/login')
    })
    cy.contains(expectedInvalidLoginErrorMessage)
  });

  it('User should see a home page upon login', () => {
    cy.logout();
    cy.login();

    cy.location().should(loc => {
      expect(loc.pathname).to.equal('/react-ui')
    })
  })

  it('If an unauthenticated user attempts to visit a url, they should be redirected to that url after login', () => {
    cy.logout();
    const originallyRequestedUrl = '/react-ui/inventory';
    cy.visit(originallyRequestedUrl);

    /* unauthenticated User should have been redirected to login page */
    cy.location().should(loc => {
      expect(loc.pathname).to.equal('/react-ui/login')
    })

    /* Type in username and password */
    cy.get('[data-test=username-input]').type(Cypress.env('loginUsername'))
    cy.get('[data-test=password-input]').type(Cypress.env('loginPassword'))

    /* Click login button */
    cy.get('[data-test=login-btn]').click();
    
    /* Exo */
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(originallyRequestedUrl)
    })
  });
})