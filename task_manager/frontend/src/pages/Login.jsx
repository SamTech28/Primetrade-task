import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // We bring in our global 'login' function from the AuthContext file!
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Hit our Flask backend
      const response = await api.post('/user/login', formData);
      
      // 1. Send the huge JWT string to our Context
      // 2. The Context saves it in localStorage permanently
      // 3. And tells the PrivateRoute bouncer "He's authorized!"
      login(response.data.token);
      
      // Send them to the protected Dashboard instantly!
      navigate('/dashboard');
    } catch (err) {
      // Shows "Invalid email or password" directly from our Python code
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <h2>Welcome Back</h2>
      {error && <div className="error-text">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email Address" 
          required 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Password" 
          required 
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Log In'}
        </button>
      </form>

      <p className="auth-switch">
        Wait, I don't have an account. <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}
