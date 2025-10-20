import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery'
window.$=window.jQuery=$
import 'popper.js/dist/umd/popper.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'






ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
