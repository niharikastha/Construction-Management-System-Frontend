// src/components/Login.js
import React, { useState } from 'react';
import './login.css'; // Import your CSS file for styling
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      console.log('Before making API request');

      const {data} = await axios.post('http://localhost:4000/api/auth/login', {email, password, role});

      // Save the authentication token in local storage
      localStorage.setItem('authToken', data.data);
      console.log('Login successful:', data);
      alert('Login Successfull !')
      navigate('/project', { state: { email } });

    } catch (error) {
      console.error('Login error:', error);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              className="password-icon"
            />
          </div>
          <span className="error-message">{passwordError}</span>
        </div>

        <div className="form-group">
          <label>Role:</label>
          <input
            type="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <span className="error-message">{roleError}</span>
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
