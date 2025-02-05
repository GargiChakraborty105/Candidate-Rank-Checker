import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for React 18+
import App from './App';
import './index.css';
import { StateProvider } from './components/StateContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </React.StrictMode>
);
