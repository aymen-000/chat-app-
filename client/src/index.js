import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserContextProvider } from './UserContext';
import "./input.css"
import { BrowserRouter ,Route } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserContextProvider>
    <BrowserRouter>
      <App />
  </BrowserRouter>
  </UserContextProvider>
);

