// src/components/Login.js
import React, { useState } from 'react';
import './Signup.css'; // Import your CSS file for styling
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');

  const handleSignup = async () => {
    // Validation checks
    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email address');
      return;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(password)) {
      setPasswordError('Password must be at least 8 characters long and include one lowercase letter, one uppercase letter, and one special character');
      return;
    } else {
      setPasswordError('');
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm Password is required');
      return;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    } else {
      setConfirmPasswordError('');
    }
    
    if (!role) {
      setRoleError('Role is required');
      return;
    } else {
      setRoleError('');
    }
    if (role.toLowerCase() !== 'admin') {
      setRoleError('Only "admin" role is allowed to signup');
      return;
    } else {
      setRoleError('');
    }
    // API call
    try {
      console.log('Before making API request');

      const { data } = await axios.post('http://localhost:4000/api/auth/signup', { email, password, confirmPassword, role });

      // Save the authentication token in local storage
      // localStorage.setItem('authToken', data.data);
      console.log('Signup successful:', data);
      alert('Signup Successfull !')
      navigate('/');

    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
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
          <label>Confirm Password:</label>
          <input
            type="text"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className="error-message">{confirmPasswordError}</span>
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
          <button type="button" onClick={handleSignup}>
            Signup
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
