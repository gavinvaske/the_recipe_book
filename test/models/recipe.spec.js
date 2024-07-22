import Chance from 'chance';
import RecipeModel from '../../application/models/recipe';
import mongoose from 'mongoose';

const chance = Chance();

describe('validation', () => {
    let recipeAttributes;

    beforeEach(() => {
        jest.resetAllMocks();
        recipeAttributes = {
            designNumber: chance.guid(),
            dieNumber: chance.guid(),
            notes: chance.string(),
            howToVideo: chance.url(),
            author: new mongoose.Types.ObjectId()
        };
    });

    describe('successful validation', () => {
        it('should validate when required attributes are defined', () => {
            const recipe = new RecipeModel(recipeAttributes);
    
            const error = recipe.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should pass validation if "notes" is not defined', () => {
            delete recipeAttributes.notes;
            const recipe = new RecipeModel(recipeAttributes);

            const error = recipe.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should pass validation if "howToVideo" is not defined', () => {
            delete recipeAttributes.howToVideo;
            const recipe = new RecipeModel(recipeAttributes);

            const error = recipe.validateSync();
    
            expect(error).toBe(undefined);
        });
    });

    describe('failing validation', () => {
        it('should fail validation if "author" is not defined', () => {
            delete recipeAttributes.author;
            const recipe = new RecipeModel(recipeAttributes);

            const error = recipe.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail validation if "designNumber" is not defined', () => {
            delete recipeAttributes.designNumber;
            const recipe = new RecipeModel(recipeAttributes);

            const error = recipe.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail validation if "dieNumber" is not defined', () => {
            delete recipeAttributes.dieNumber;
            const recipe = new RecipeModel(recipeAttributes);

            const error = recipe.validateSync();
    
            expect(error).not.toBe(undefined);
        });
    });

    describe('data transformation', () => {
        it('should trim whitespace around "designNumber"', () => {
            const designNumber = chance.string();
            recipeAttributes.designNumber = ' ' + designNumber + ' ';

            const recipe = new RecipeModel(recipeAttributes);


            expect(recipe.designNumber.toUpperCase()).toBe(designNumber.toUpperCase());
        });

        it('should trim whitespace around "dieNumber"', () => {
            const dieNumber = chance.string();
            recipeAttributes.dieNumber = ' ' + dieNumber + ' ';

            const recipe = new RecipeModel(recipeAttributes);


            expect(recipe.dieNumber.toUpperCase()).toBe(dieNumber.toUpperCase());
        });

        it('should convert "designNumber" to UPPERCASE', () => {
            const designNumber = chance.guid();
            recipeAttributes.designNumber = designNumber.toLowerCase();

            const recipe = new RecipeModel(recipeAttributes);

            expect(recipe.designNumber).toBe(designNumber.toUpperCase());
        });

        it('should convert "dieNumber" to UPPERCASE', () => {
            const dieNumber = chance.guid();
            recipeAttributes.dieNumber = dieNumber.toLowerCase();

            const recipe = new RecipeModel(recipeAttributes);

            expect(recipe.dieNumber).toBe(dieNumber.toUpperCase());
        });
    });

});