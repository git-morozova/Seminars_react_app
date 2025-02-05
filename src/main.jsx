import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '/src/css/main.css'
import App from './App.jsx'
import { ToastContainer } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer floatingTime={5000} />
  </StrictMode>,
)
