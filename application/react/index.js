import React from 'react'
import { createRoot } from 'react-dom/client';
import { App } from './App/App'
import { BrowserRouter } from 'react-router-dom';
import { FlashMessagePanel } from './_global/FlashMessagePanel/FlashMessagePanel';

const rootHtmlElement = document.getElementById('root');
const root = createRoot(rootHtmlElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FlashMessagePanel />
      <App onClick={() => alert('foo')}/>
    </BrowserRouter>
  </React.StrictMode>
);