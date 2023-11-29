import { injectReactComponentIntoTheDom } from '../helperMethods'

import Banner from '../Banner/Banner';
import QuoteForm from '../QuoteForm/QuoteForm';

injectReactComponentIntoTheDom('#react-banner', Banner);
injectReactComponentIntoTheDom('#react-create-quote', QuoteForm);
