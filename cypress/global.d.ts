// To learn more about this file, see: https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/global.d.ts

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(): void;
    invalidLogin(): void;
    logout(): void;
  }
}