import React from 'react';
import { Route, Routes } from 'react-router-dom';
import QuoteForm from '../Quote/QuoteForm/QuoteForm';
import CustomerForm from '../Customer/CustomerForm/CustomerForm';
import DeliveryMethodForm from '../DeliveryMethod/DeliveryMethodForm/DeliveryMethodForm'
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

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes >
        <Route path='react-ui'>
          <Route element={<TopNavbarLayout />}>
            <Route path='inventory' element={<Inventory />}></Route>

            <Route path='forms'>
              <Route path='delivery-method' element={<DeliveryMethodForm />} />
              <Route path='credit-term' element={<CreditTermForm />} />
              <Route path='quote' element={<QuoteForm />} />
              <Route path='customer' element={<CustomerForm />} />
              <Route path="liner-type/:mongooseId?" element={<LinerTypeForm />} /> {/* TODO (6-5-2024): Enforce admin routes only render for admins */}
              <Route path='material/:mongooseId?' element={<MaterialForm />} />
              <Route path='adhesive-category' element={<AdhesiveCategoryForm />} />
            </Route>

            <Route path='tables'>
              <Route path='credit-term' element={<CreditTermTable />} />
              <Route path='delivery-method' element={<DeliveryMethodTable />} />
              <Route path='liner-type' element={<LinerTypeTable />} />
              <Route path='material' element={<MaterialTable />} />
            </Route>
          </Route>

          <Route path='*' element={<div>404 Page Not Found</div>} />
        </Route>
      </Routes>
    </QueryClientProvider>
  )
}