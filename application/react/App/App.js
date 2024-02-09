import { Route, Routes } from 'react-router-dom';
import DeliveryMethodForm from '../DeliveryMethod/DeliveryMethodForm/DeliveryMethodForm'

import QuoteForm from '../Quote/QuoteForm/QuoteForm';
import CustomerForm from '../Customer/CustomerForm/CustomerForm';
import DeliveryMethodForm from '../DeliveryMethod/DeliveryMethodForm/DeliveryMethodForm'
import CreditTermsForm from '../CreditTerms/CreditTermsForm/CreditTermsForm';
import CreditTermsTable from '../CreditTerms/CreditTermsTable/CreditTermsTable';
import DeliveryMethodTable from '../DeliveryMethod/DeliveryMethodTable/DeliveryMethodTable';

export function App() {
  return (
    <Routes>
      <Route path="react-ui/forms">
        <Route path="delivery-method" element={<DeliveryMethodForm />} />
        <Route path="credit-term" element={<CreditTermsForm />} />
        <Route path="quote" element={<QuoteForm />} />
        <Route path="customer" element={<CustomerForm />} />
      </Route>

      <Route path="react-ui/tables">
        <Route path="credit-term" element={<CreditTermsTable />} />
        <Route path="delivery-method" element={<DeliveryMethodTable />} />
      </Route>

      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  )
}