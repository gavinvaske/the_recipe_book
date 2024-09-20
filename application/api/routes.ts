import defaultRoute from './controllers/index.ts';
import userEndpoints from './controllers/userController.ts';
import recipeEndpoints from './controllers/recipeController.ts';

import adminEndpoints from './controllers/adminController.ts';
import finishEndpoints from './controllers/finishController.ts';
import machineEndpoints from './controllers/machineController.ts';
import materialEndpoints from './controllers/materialController.ts';
import setupEndpoints from './controllers/setupController.ts';
import printingSetupEndpoints from './controllers/printingSetupController.ts';
import cuttingSetupEndpoints from './controllers/cuttingSetupController.ts';
import windingSetupEndpoints from './controllers/windingSetupController.ts';
import vendorEndpoints from './controllers/vendorController.ts';
import materialOrderEndpoints from './controllers/materialOrdersController.ts';
import ticketEndpoints from './controllers/ticketController.ts';
import productEndpoints from './controllers/productController.ts';
import holdReasonEndpoints from './controllers/holdReasonController.ts';
import proofEndpoints from './controllers/proofController.ts';
import dieLineEndpoints from './controllers/dieLineController.ts';
import spotPlateEndpoints from './controllers/spotPlateController.ts';
import requestEndpoints from './controllers/requestController.ts';
import materialCategoryEndpoints from './controllers/materialCategoryController.ts';
import filePlanEndpoints from './controllers/filePlanController.ts';
import packagingEndpoints from './controllers/packagingController.ts';
import quoteEndpoints from './controllers/quoteController.ts';
import dieEndpoints from './controllers/dieController.ts';
import linerTypeEndpoints from './controllers/linerTypeController.ts';
import adhesiveCategoryEndpoints from './controllers/adhesiveCategoryController.ts';
import materialLengthAdjustmentEndpoints from './controllers/materialLengthAdjustmentController.ts';
import customerEndpoints from './controllers/customerController.ts';
import deliveryMethodEndpoints from './controllers/deliveryMethodController.ts';
import creditTermEndpoints from './controllers/creditTermsController.ts';
import authEndpoints from './controllers/authController.ts'
import { Application } from 'express';

export const setupApiRoutes = (app: Application) => {
  app.use('/auth', authEndpoints);
  app.use('/', defaultRoute);
  app.use('/users', userEndpoints);
  app.use('/recipes', recipeEndpoints);
  app.use('/admin', adminEndpoints);
  app.use('/finishes', finishEndpoints);
  app.use('/machines', machineEndpoints);
  app.use('/materials', materialEndpoints);
  app.use('/setups', setupEndpoints);
  app.use('/printing-setups', printingSetupEndpoints);
  app.use('/cutting-setups', cuttingSetupEndpoints);
  app.use('/winding-setups', windingSetupEndpoints);
  app.use('/vendors', vendorEndpoints);
  app.use('/material-orders', materialOrderEndpoints);
  app.use('/tickets', ticketEndpoints);
  app.use('/products', productEndpoints);
  app.use('/hold-reasons', holdReasonEndpoints);
  app.use('/proofs', proofEndpoints);
  app.use('/die-lines', dieLineEndpoints);
  app.use('/spot-plates', spotPlateEndpoints);
  app.use('/requests', requestEndpoints);
  app.use('/material-categories', materialCategoryEndpoints);
  app.use('/file-plan', filePlanEndpoints);
  app.use('/packaging', packagingEndpoints);
  app.use('/quotes', quoteEndpoints);
  app.use('/dies', dieEndpoints);
  app.use('/liner-types', linerTypeEndpoints);
  app.use('/adhesive-categories', adhesiveCategoryEndpoints);
  app.use('/material-length-adjustments', materialLengthAdjustmentEndpoints);
  app.use('/customers', customerEndpoints);
  app.use('/delivery-methods', deliveryMethodEndpoints);
  app.use('/credit-terms', creditTermEndpoints);
}
