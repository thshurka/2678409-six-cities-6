import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app';

const PLACES_COUNT = 312;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App placesCount={PLACES_COUNT} />
  </React.StrictMode>
);
