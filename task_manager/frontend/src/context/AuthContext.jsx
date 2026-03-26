import { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

// Create the Context (Global State)
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Don't show UI until we check localStorage

  // Run this once when the app first loads
  useEffect(() => {
    checkLoggedInStatus();
  }, []);

  const checkLoggedInStatus = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Decode the token to get the user's ID and Role
        const decodedUser = jwtDecode(token);
        
        // Very basic expiry check (tokens have an 'exp' Unix timestamp)
        const currentTime = Date.now() / 1000;
        if (decodedUser.exp < currentTime) {
          logout(); // Token expired!
        } else {
          setUser(decodedUser); // Token valid, log them in!
        }
      } catch (err) {
        logout(); // Token was invalid/corrupted
      }
    }
    setLoading(false);
  };

  const login = (token) => {
    localStorage.setItem('token', token); // Save to browser
    checkLoggedInStatus(); // Decode and set the user state
  };

  const logout = () => {
    localStorage.removeItem('token'); // Delete from browser
    setUser(null); // Clear the state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
