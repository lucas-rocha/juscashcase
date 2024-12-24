import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/variables.css'
import './styles/globals.css'
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);