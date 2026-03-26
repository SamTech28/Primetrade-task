import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Import our pages
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// A special component to protect our Dashboard route!
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  // Wait until we check localStorage before rendering
  if (loading) return <div style={{ color: 'white' }}>Loading securely...</div>;
  
  // If user is logged in, show the Dashboard. If not, boot them to Login!
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        
        {/* Any unknown URL will redirect to the Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
