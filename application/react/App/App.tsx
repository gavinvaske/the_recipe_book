import React from 'react';
import { Route, Routes } from 'react-router-dom';
import QuoteForm from '../Quote/QuoteForm/QuoteForm';
import { CustomerForm } from '../Customer/CustomerForm/CustomerForm';
import { DeliveryMethodForm } from '../DeliveryMethod/DeliveryMethodForm/DeliveryMethodForm'
import { CreditTermForm } from '../CreditTerm/CreditTermForm/CreditTermForm';
import { CreditTermTable } from '../CreditTerm/CreditTermTable/CreditTermTable';
import DeliveryMethodTable from '../DeliveryMethod/DeliveryMethodTable/DeliveryMethodTable';
import Inventory from '../Inventory/Inventory';
import { LinerTypeForm } from '../LinerType/LinerTypeForm/LinerTypeForm';
import { LinerTypeTable } from '../LinerType/LinerTypeTable/LinerTypeTable';
import { MaterialForm } from '../Material/MaterialForm/MaterialForm';
import { AdhesiveCategoryForm } from '../AdhesiveCategory/AdhesiveCategoryForm/AdhesiveCategoryForm';
import { MaterialTable } from '../Material/MaterialTable/MaterialTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TopNavbarLayout } from '../_layouts/TopNavbarLayout';
import { PageNotFound } from '../404/404';
import { MaterialLengthAdjustmentForm } from '../MaterialLengthAdjustment/MaterialLengthAdjustmentForm/MaterialLengthAdjustmentForm';
import { AdhesiveCategoryTable } from '../AdhesiveCategory/AdhesiveCategoryTable/AdhesiveCategoryTable';
import { CustomerTable } from '../Customer/CustomerTable/CustomerTable';
import { MaterialOrderForm } from '../MaterialOrder/MaterialOrderForm/MaterialOrderForm';
import { MaterialOrderTable } from '../MaterialOrder/MaterialOrderTable/MaterialOrderTable';
import { ProtectedRoute } from '../_auth/ProtectedRoute/ProtectedRoute';
import { Login } from '../_auth/Login/Login';
import { USER, ADMIN } from '../../api/enums/authRolesEnum'
import { ForgotPassword } from '../_auth/ForgotPassword/ForgotPassword';
import { ChangePassword } from '../_auth/ChangePassword/ChangePassword';
import { Register } from '../_auth/Register/Register';
import { Unauthorized } from '../_auth/Unauthorized/Unauthorized';
import { Profile } from '../User/Profile/Profile';
import { CrudNavigation } from '../CrudNavigation/CrudNavigation';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes >
        <Route path='react-ui'>

          {/* PUBLIC ROUTES*/}
          <Route path='login' element={<Login />}></Route>
          <Route path='register' element={<Register />}></Route>

          <Route path='forgot-password' element={<ForgotPassword />}></Route>
          <Route path='change-password/:mongooseId/:token' element={<ChangePassword />} />
          <Route path='unauthorized' element={<Unauthorized />} />
          <Route path='*' element={<PageNotFound />} />
            
            {/* PROTECTED ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={[USER, ADMIN]}/>}>
              <Route element={<TopNavbarLayout />}>
                <Route path='inventory' element={<Inventory />}></Route>
                <Route path='profile' element={<Profile />} />
                <Route path='crud-navigation' element={<CrudNavigation />} />

                <Route path='forms'>
                  <Route path='material-length-adjustment' element={<MaterialLengthAdjustmentForm />} />
                  <Route path='delivery-method/:mongooseId?' element={<DeliveryMethodForm />} />
                  <Route path='credit-term/:mongooseId?' element={<CreditTermForm />} />
                  <Route path='quote' element={<QuoteForm />} />
                  <Route path='customer/:mongooseId?' element={<CustomerForm />} />
                  <Route path="liner-type/:mongooseId?" element={<LinerTypeForm />} /> {/* TODO (6-5-2024): Enforce admin routes only render for admins */}
                  <Route path='material/:mongooseId?' element={<MaterialForm />} />
                  <Route path='adhesive-category/:mongooseId?' element={<AdhesiveCategoryForm />} />
                  <Route path='material-order/:mongooseId?' element={<MaterialOrderForm />} />
                </Route>

                <Route path='tables'>
                  <Route path='credit-term' element={<CreditTermTable />} />
                  <Route path='delivery-method' element={<DeliveryMethodTable />} />
                  <Route path='liner-type' element={<LinerTypeTable />} />
                  <Route path='material' element={<MaterialTable />} />
                  <Route path='adhesive-category' element={<AdhesiveCategoryTable />} />
                  <Route path='customer' element={<CustomerTable />} />
                  <Route path='material-order' element={<MaterialOrderTable />} />
                </Route>

              </Route>
          </Route>

        </Route>
      </Routes>
    </QueryClientProvider>
  )
}