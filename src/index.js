import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'helpers/initFA';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Main from 'Main';


const root = createRoot(document.getElementById('main'));

root.render(
  <Router basename={process.env.PUBLIC_URL}>
    <Main>
      <App />
    </Main>
    <ToastContainer />
  </Router>
);

