import ejsService from '../../application/services/ejsService';

describe('ejsService test suite', () => {
    it('should have a method named prettifyDuration()', () => {
        expect(ejsService.prettifyDuration).toBeDefined();
    });
    
    it('should have a method named getDate()', () => {
        expect(ejsService.getDate).toBeDefined();
    });

    it('should have a method named getDate()', () => {
        expect(ejsService.getDayNumberAndMonth).toBeDefined();
    });

    it('should have a method named getOverallTicketDuration()', () => {
        expect(ejsService.getOverallTicketDuration).toBeDefined();
    });

    it('should have a method named getHowLongTicketHasBeenInProduction()', () => {
        expect(ejsService.getHowLongTicketHasBeenInProduction).toBeDefined();
    });

    it('should have a method named getHowLongTicketHasBeenInDepartment()', () => {
        expect(ejsService.getHowLongTicketHasBeenInDepartment).toBeDefined();
    });

    it('should have a method named getHowLongTicketHasHadADepartmentStatus()', () => {
        expect(ejsService.getHowLongTicketHasHadADepartmentStatus).toBeDefined();
    });

    it('should have a method named getEmptyObjectIfUndefined()', () => {
        expect(ejsService.getEmptyObjectIfUndefined).toBeDefined();
    });

    it('should have a method named getEmptyArrayIfUndefined()', () => {
        expect(ejsService.getEmptyArrayIfUndefined).toBeDefined();
    });
});