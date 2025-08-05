/* Main Font - Rubik (Buttons/Body) */
import '@fontsource/rubik/400.css';  // Regular
import '@fontsource/rubik/500.css';  // Medium
import '@fontsource/rubik/700.css';  // Bold

/* Heading Font - Archivo Narrow */
import '@fontsource/archivo-narrow/400.css';  // Regular
import '@fontsource/archivo-narrow/600.css';  // SemiBold
import '@fontsource/archivo-narrow/700.css';  // Bold

/* Symbol Font - Space Grotesk */
import '@fontsource-variable/space-grotesk'; // All weights

/* Hero Font - Anton */
import '@fontsource/anton'; // All weights

import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './GlobalStyles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
