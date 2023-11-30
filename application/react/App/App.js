import { injectReactComponentIntoTheDom } from '../helperMethods'

import Banner from '../Banner/Banner';
import QuoteForm from '../Quote/QuoteForm/QuoteForm';

injectReactComponentIntoTheDom('#react-banner', Banner);
injectReactComponentIntoTheDom('#react-quote-form', QuoteForm);
