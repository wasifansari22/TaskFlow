import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App.jsx';
import { store } from './app/store.js';
import ResponsiveToaster from './components/ui/ResponsiveToaster.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ResponsiveToaster />
    </Provider>
  </StrictMode>,
);
