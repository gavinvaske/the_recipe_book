import React from 'react';
import { Route, Routes } from 'react-router-dom';
import QuoteForm from '../Quote/QuoteForm/QuoteForm';
import CustomerForm from '../Customer/CustomerForm/CustomerForm';
import DeliveryMethodForm from '../DeliveryMethod/DeliveryMethodForm/DeliveryMethodForm'
import CreditTermsForm from '../CreditTerms/CreditTermsForm/CreditTermsForm';
import CreditTermsTable from '../CreditTerms/CreditTermsTable/CreditTermsTable';
import DeliveryMethodTable from '../DeliveryMethod/DeliveryMethodTable/DeliveryMethodTable';
import Inventory from '../Inventory/Inventory';
import { LinerTypeForm } from '../LinerType/LinerTypeForm/LinerTypeForm';
import { LinerTypeTable } from '../LinerType/LinerTypeTable/LinerTypeTable';
import { MaterialForm } from '../Material/MaterialForm/MaterialForm';
import { AdhesiveCategoryForm } from '../AdhesiveCategory/AdhesiveCategoryForm/AdhesiveCategoryForm';
import { MaterialTable } from '../Material/MaterialTable/MaterialTable';

export function App() {
  return (
    <Routes >
      <Route path='react-ui'>
        <Route path='inventory' element={<Inventory />}></Route>

        <Route path='forms'>
          <Route path='delivery-method' element={<DeliveryMethodForm />} />
          <Route path='credit-term' element={<CreditTermsForm />} />
          <Route path='quote' element={<QuoteForm />} />
          <Route path='customer' element={<CustomerForm />} />
          <Route path="liner-type/:mongooseId?" element={<LinerTypeForm />} /> {/* TODO (6-5-2024): Enforce admin routes only render for admins */}
          <Route path='material' element={<MaterialForm />} />
          <Route path='adhesive-category' element={<AdhesiveCategoryForm />} />
        </Route>

        <Route path='tables'>
          <Route path='credit-term' element={<CreditTermsTable />} />
          <Route path='delivery-method' element={<DeliveryMethodTable />} />
          <Route path='liner-type' element={<LinerTypeTable />} />
          <Route path='material' element={<MaterialTable />} />
        </Route>

        <Route path='*' element={<div>404 Page Not Found</div>} />
      </Route>
    </Routes>
  )
}