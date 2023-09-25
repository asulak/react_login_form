import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom;'

# Note AuthProvider encloses the app

ReactDOM.render(
  <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <Routes>
      <Route path="/*" element={<App/>} /> # /* Means we'll have routes nested inside the root 
    </Routes>
      <App />
    </AuthProvider>
  </BrowserRouter
  </React.StrictMode>,
  document.getElementById('root')
);
