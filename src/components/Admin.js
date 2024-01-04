import React, { useState } from 'react';
import './Admin.css'; // Import the CSS file for styles
const Admin = () => {
 const [userData, setUserData] = useState({
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    role: 'projectManager',
 });

 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 const handleChange = (e) => {
  const { name, value } = e.target;

  // Basic client-side validations
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

  if (name === 'mobileNumber') {
    const regex = /^\d{10}$/;
    if (!regex.test(value)) {
      setError('Mobile phone number should be 10 digits only');
    } else {
      setError(null);
    }
  }

  setUserData({ ...userData, [name]: value });
};

const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission

  try {
    if (error) {
      // If there is an error, don't proceed with the submission
      return;
    }

    setLoading(true);

    const response = await fetch('http://localhost:3001/add_users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to add user');
    }

    console.log('User added successfully');
    // Optionally, you can redirect or show a success message here
    alert('User successfully added');
  } catch (err) {
    console.error('Error adding user:', err);
    // Handle error scenarios
    alert('Error adding user. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="admin-container">
      <h1>Add User (Admin Panel)</h1>
      <form onSubmit={handleSubmit} className="form-box">
        {/* Input fields with labels */}
        <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            placeholder="Username"
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
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobileNumber"
            value={userData.mobileNumber}
            onChange={handleChange}
            placeholder="Mobile Number"
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
            <option value="projectManager">Project Manager</option>
            <option value="contractor">Contractor</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>

        {/* Display error message if there's an error */}
        {error && <p className="error-message">{error}</p>}

        {/* Submit button */}
        <div className="input-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Adding User...' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Admin;
