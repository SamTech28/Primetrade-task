import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  // Store what the user types locally in state
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // React Router hook to move the user between pages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing on submit
    setError('');
    setLoading(true);

    try {
      // Send the data exactly to the Python backend we wrote earlier!
      await api.post('/user/register', formData);
      
      // If it returns 201 Created successfully, immediately send them to the Login page
      navigate('/login');
    } catch (err) {
      // If the Backend returns an error (e.g., "User already exists"), show it in the UI
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <h2>Create an Account</h2>
      {error && <div className="error-text">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Full Name" 
          required 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          required 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Create Password" 
          required 
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
      
      <p className="auth-switch">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
}
