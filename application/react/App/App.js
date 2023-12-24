import { injectReactComponentIntoTheDom } from '../helperMethods'

import Banner from '../Banner/Banner';
import QuoteForm from '../Quote/QuoteForm/QuoteForm';
import DeliveryMethodForm from '../DeliveryMethod/DeliveryMethodForm/DeliveryMethodForm'
import CreditTermsForm from '../CreditTerms/CreditTermsForm/CreditTermsForm';
import CreditTermsTable from '../CreditTerms/CreditTermsTable/CreditTermsTable';
import DeliveryMethodTable from '../DeliveryMethod/DeliveryMethodTable/DeliveryMethodTable';

injectReactComponentIntoTheDom('#react-banner', Banner);
injectReactComponentIntoTheDom('#react-quote-form', QuoteForm);
injectReactComponentIntoTheDom('#react-delivery-method-form', DeliveryMethodForm);
injectReactComponentIntoTheDom('#react-credit-terms-form', CreditTermsForm);
injectReactComponentIntoTheDom('#react-credit-terms-table', CreditTermsTable);
injectReactComponentIntoTheDom('#react-delivery-methods-table', DeliveryMethodTable);
