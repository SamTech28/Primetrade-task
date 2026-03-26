import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* By wrapping our entire app in AuthProvider, ANY page can instantly check if the user is logged in! */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
