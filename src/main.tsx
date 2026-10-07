// Polyfill fetch setter if window.fetch only has a getter (fixes iframe / extension conflicts)
try {
  let originalFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get: () => originalFetch,
    set: (newFetch) => {
      originalFetch = newFetch;
    },
    configurable: true,
    enumerable: true,
  });
} catch {
  // Ignored if window.fetch is already configurable
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
