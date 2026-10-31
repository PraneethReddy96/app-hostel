import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import StudentPortalApp from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudentPortalApp />
  </StrictMode>
);

