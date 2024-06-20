const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const MaterialCategoryModel = require('../models/materialCategory');
const { SERVER_ERROR } = require('../enums/httpStatusCodes'); 

router.use(verifyJwtToken);

const SHOW_ALL_MATERIAL_CATEGORIES_ENDPOINT = '/material-categories';

router.get('/', async (_, response) => {
  try {
    const materialCategories = await MaterialCategoryModel.find().exec();
    
    return response.json(materialCategories);
} catch (error) {
    console.error('Error fetching Material Categories: ', error.message);
    return response
        .status(SERVER_ERROR)
        .send(error.message);
}
});

router.get('/form', (_, response) => {
    response.render('createMaterialCategory.ejs');
});

router.get('/form/:id', async (request, response) => {
    try {
        const materialCategory = await MaterialCategoryModel.findById(request.params.id);

        return response.render('updateMaterialCategory', { materialCategory });
    } catch (error) {
        console.log(error);
        request.flash('errors', [error.message]);

        return response.status(SERVER_ERROR_CODE).redirect('back');
    }
});

router.post('/form/:id', async (request, response) => {
    try {
        await MaterialCategoryModel.findByIdAndUpdate(request.params.id, request.body, { runValidators: true }).exec();

        return response.redirect(SHOW_ALL_MATERIAL_CATEGORIES_ENDPOINT);
    } catch (error) {
        console.log(error);
        request.flash('errors', [error.message]);

        return response.status(SERVER_ERROR_CODE).redirect('back');
    }
});

router.post('/form', async (request, response) => {
    try {
        await MaterialCategoryModel.create(request.body);
    } catch (error) {
        console.log(error);
        request.flash('errors', ['Unable to save the Material Category, the following error(s) occurred:', error.message]);
        return;
    }
    request.flash('alerts', ['Material Category created successfully']);

    return response.redirect(SHOW_ALL_MATERIAL_CATEGORIES_ENDPOINT);
});


router.get('/delete/:id', async (request, response) => {
    const { id } = request.params;

    try {
        await MaterialCategoryModel.deleteById(id);

        return response.redirect(SHOW_ALL_MATERIAL_CATEGORIES_ENDPOINT);
    } catch (error) {
        console.log(error);
        return response.status(SERVER_ERROR_CODE).send(error.message);
    }
});

module.exports = router;