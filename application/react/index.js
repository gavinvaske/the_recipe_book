import React from 'react'
import { createRoot } from 'react-dom/client';
import { App } from './App/App'
import { BrowserRouter } from 'react-router-dom';
import { FlashMessages } from './_global/FlashMessage/FlashMessages';

const rootHtmlElement = document.getElementById('root');
const root = createRoot(rootHtmlElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FlashMessages />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);