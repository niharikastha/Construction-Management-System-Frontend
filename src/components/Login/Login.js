import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
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

    try {
      console.log('Before making API request');

      const {data} = await axios.post('http://localhost:4000/api/auth/login', {email, password});

      localStorage.setItem('authToken', data.data.token);
      console.log('Login successful:', data);

      if(data.msg === 'User loggedIn ' && data.data.userRole != undefined)
      {
        alert ('Login Successfull!');
        if (data.data.userRole === 'project manager') {
          navigate('/project',{ state: { email: email } });
        } else if (data.data.userRole === 'supervisor') {
          navigate('/supervisor',{ state: { email: email } });
        }  else if (data.data.userRole === 'contractor') {
          navigate('/contractor',{ state: { email: email } });
        }else if (data.data.userRole === 'admin') {
          navigate('/admin',{ state: { email: email } });}
      }
      else
      {
        alert("Wrong Email or password.")
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('please try again.')
    }
    console.log("after making api request!")
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
          <button type="button" onClick={handleLogin}>
            Login
          </button>
          <Link to="/signup" className="signup-text">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
