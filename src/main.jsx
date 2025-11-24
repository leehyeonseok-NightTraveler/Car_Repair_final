import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// ★ 1. 이 줄이 꼭 있어야 합니다.
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  // ★ 2. App을 BrowserRouter로 꼭 감싸야 합니다.
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)