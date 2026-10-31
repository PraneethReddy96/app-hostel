import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import ManagementPortalApp from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ManagementPortalApp />
  </StrictMode>
);

