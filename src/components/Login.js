// src/components/Login.js
import React, { useState } from 'react';
import './login.css'; // Import your CSS file for styling
import { login } from '../services/api'; // Adjust the path based on your project structure

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
  
    const handleLogin = async () => {
      // Validation checks
      if (!email) {
        setEmailError('Email is required');
        return;
      } else {
        setEmailError('');
      }
  
      if (!password) {
        setPasswordError('Password is required');
        return;
      } else {
        setPasswordError('');
      }
  
      // API call
      try {
        const result = await login(email, password);
        // Handle successful login
        console.log('Login successful:', result);
      } catch (error) {
        // Handle login error
        console.error('Login error:', error);
      }
    };
  
    return (
      <div className="auth-container">
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="error-message">{emailError}</span>
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="error-message">{passwordError}</span>
          </div>
          <div className="form-group">
            <button type="button" onClick={handleLogin}>
              Login
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default Login;