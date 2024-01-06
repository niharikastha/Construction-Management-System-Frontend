import React, { useState } from 'react';
import './Admin.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state.email;
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'project manager',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'confirmPassword') {
      if (value !== userData.password) {
        setError('Passwords do not match');
      } else {
        setError(null);
      }
    }

    if (name === 'email') {
      const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (!regex.test(value)) {
        setError('Invalid email address');
      } else {
        setError(null);
      }
    }

    if (name === 'password') {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(value)) {
        setError('Password should be at least 8 characters long, with capital letter, number, and a special character');
      } else {
        setError(null);
      }
    }


    setUserData({ ...userData, [name]: value });
  };

  const handleLogout = async () => {
    const authToken = localStorage.getItem('authToken');
    console.log(authToken, "before");
    await localStorage.removeItem('authToken');

    const authTokenAfterRemoval = localStorage.getItem('authToken');
    console.log(authTokenAfterRemoval, "after");

    navigate('/');
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      if (error) {
        return;
      }

      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      console.log(authToken + "authToken");
      const { data } = await axios.post('http://localhost:4000/api/admin/adduser', userData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );

      console.log('User added successfully');
      alert('User successfully added');
    } catch (err) {
      console.error('Error adding user:', err);
      alert('Error adding user. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <p>Dream Home Reality</p>
        </div>
        <h1 className="navbar-usertype">Admin</h1>

        <div className="navbar-right">
          <p className="navbar-useremail">{email}</p>
          <span className="logout" onClick={handleLogout} style={{ cursor: 'pointer', marginLeft: '10px' }}>
            Logout
          </span>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </div>
      </nav>
      <div className="admin-container">
=        <form onSubmit={handleSubmit} className="form-box">
          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="name"
            />
          </div>

          <div className="input-group">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>



          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          <div className="input-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />
          </div>

          <div className="input-group">
            <label>Role:</label>
            <select name="role" value={userData.role} onChange={handleChange}>
              <option value="project manager">Project Manager</option>
              <option value="contractor">Contractor</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Adding User...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
