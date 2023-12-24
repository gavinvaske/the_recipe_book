import { injectReactComponentIntoTheDom } from '../helperMethods'

import Banner from '../Banner/Banner';
import QuoteForm from '../Quote/QuoteForm/QuoteForm';
import CreditTermsForm from '../CreditTerms/CreditTermsForm/CreditTermsForm';
import CreditTermsTable from '../CreditTerms/CreditTermsTable/CreditTermsTable';

injectReactComponentIntoTheDom('#react-banner', Banner);
injectReactComponentIntoTheDom('#react-quote-form', QuoteForm);
injectReactComponentIntoTheDom('#react-credit-terms-form', CreditTermsForm);
injectReactComponentIntoTheDom('#react-credit-terms-table', CreditTermsTable);
