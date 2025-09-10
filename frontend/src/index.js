import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import BrowserDetection from './utils/BrowserDetection';

// Initialize browser detection and apply classes to the document
BrowserDetection.applyBrowserClasses();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
