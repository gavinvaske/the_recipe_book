import React from 'react'
import { createRoot } from 'react-dom/client';
import { App } from './App/App'
import { BrowserRouter } from 'react-router-dom';
import { FlashMessagePanel } from './_global/FlashMessagePanel/FlashMessagePanel';
import { AuthProvider } from './_context/authProvider';
/* TODO: @Gavin: 9-14-2024: Ask storm which of these files he absolutely needs? */
import '../public/css/all.css';
import '../public/css/resets.css';
import '../public/css/typography.css';
import '../public/css/flexbox-framework.css';
import '../public/css/buttons.css';
import '../public/css/jquery-ui.css';
import '../public/css/workflow.css';
import '../public/css/responsive.css';
import '../public/css/main.css';

const rootHtmlElement = document.getElementById('root');
const root = createRoot(rootHtmlElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> 
        <FlashMessagePanel />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);