import Banner from '../Banner/Banner';
import { createRoot } from 'react-dom/client';

const reactBannerHtmlElement = document.getElementById('react-banner');
const reactBannerRoot = createRoot(reactBannerHtmlElement);

reactBannerRoot.render(<Banner/>);