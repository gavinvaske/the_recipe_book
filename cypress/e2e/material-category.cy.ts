describe('MaterialCategory Views', () => {
    const formUrlPrefix = '/react-ui/forms'
    const tableUrlPrefix = '/react-ui/tables'

    beforeEach(() => {
        cy.login();
    });

    it('Should render the MategoryCategory form', () => {
        cy.visit(`${formUrlPrefix}/material-category`);

        cy.get('[data-test=material-category-form]').should('exist');
    });

    it('Should render the MaterialCategory table and searchbar', () => {
        cy.visit(`${tableUrlPrefix}/material-category`);

        cy.get('#material-category-table').should('exist');
        cy.get('[data-test=searchbar]').should('exist');
    });
});