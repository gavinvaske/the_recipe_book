import { createRoot } from 'react-dom/client';

export function injectReactComponentIntoTheDom(htmlSelector, Component) {
    const htmlElements = document.querySelectorAll(htmlSelector);
    
    if (!htmlElements) {
        return;
    }

    htmlElements.forEach((htmlElement) => {
        const root = createRoot(htmlElement);
        root.render(<Component/>);
    })
}