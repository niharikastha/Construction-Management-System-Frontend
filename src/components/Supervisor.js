import React, { useState, useEffect } from 'react';
import './ProjectManager.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Supervisor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state.email;

  const [work, setWork] = useState({
    supervisorId: '',
    name: '',
    assignment: '',
    task: '',
    description: '',
  });

  const [works, setWorks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [editingWork, setEditingWork] = useState({
    id: '',
    name: '',
    assignment: '',
    task: '',
    description: '',
  });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWork({ ...work, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingWork({ ...editingWork, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem('authToken');

      const newWork = {
        name: work.name,
        assignment: work.assignment,
        task: work.task,
        description: work.description,
      };

      const { data } = await axios.post('http://localhost:4000/api/user/addSupervisor', newWork, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      newWork._id = data.data._id;

      setWorks([...works, newWork]);
      setWork({
        name: '',
        assignment: '',
        task: '',
        description: '',
      });
      setShowForm(false);
    } catch (error) {
      alert("Error adding work. Try again later.")
      console.error('Error adding work:', error);
    }
  };

  const handleUpdate = async (workId) => {
    setIsEditing(workId);
    try {
      const workToUpdate = works.find((proj) => proj._id === workId);
      console.log(workToUpdate, "updated");
      setEditingWork({ ...workToUpdate });
    } catch (error) {
      console.error('Error updating work:', error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const index = works.findIndex((proj) => proj._id === editingWork._id);

      if (index !== -1) {
        setWorks((previous) => {
          const updatedWorks = [...previous];
          updatedWorks[index] = editingWork;
          console.log(updatedWorks, "updated works")
          return updatedWorks;
        });
      } else {
        console.error("Work not found in the array.");
      }
      const authToken = localStorage.getItem('authToken');
      console.log(editingWork, "form");
      await axios.patch(`http://localhost:4000/api/user/updateSupervisor/${editingWork._id}`, editingWork, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      setEditingWork({
        id: '',
        name: '',
        assignment: '',
        task: '',
        description: '',
      });
      setIsEditing(null);
    } catch (error) {
      alert("Error updating work. Try again later.")
      console.error('Error updating work:', error);
    }
  };

  const handleDelete = async (workId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:4000/api/user/deleteSupervisor/${workId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      setWorks(works.filter((proj) => proj._id !== workId));
    } catch (error) {
      alert("Error deleting data. Try again later.")
      console.error('Error deleting work:', error);
    }
  };

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        const { data } = await axios.get('http://localhost:4000/api/user/getSupervisor', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log(data, "data fetched");
        setWorks(data.data);

        const filteredWorks = data.data.filter(proj =>
          proj.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setWorks(filteredWorks);
      } 
      catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchWorks();
  }, [searchTerm]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <p>Dream Home Reality</p>
        </div>
        <h1 className="navbar-usertype">Supervisor</h1>

        <div className="navbar-right">

          <p className="navbar-useremail">{email}</p>
          <span className="logout" onClick={handleLogout} style={{ cursor: 'pointer', marginLeft: '10px' }}>
            Logout
          </span>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </div>
      </nav>

      <div className="project-manager-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <h2>Add a new Supervising Task</h2>
        <button className="add-project-button" onClick={toggleForm}>
          Add New Task
        </button>

        {showForm && (
          <form className="project-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" name="name" value={work.name} onChange={handleChange} />
            </label>
            <label>
              Assignment:
              <input type="text" name="assignment" value={work.assignment} onChange={handleChange} />
            </label>
            <label>
              Task completed/not:
              <input type="text" name="task" value={work.task} onChange={handleChange} />
            </label>
            <label>
              Description:
              <textarea name="description" value={work.description} onChange={handleChange} />
            </label>
            <button type="submit">Add Project</button>
          </form>
        )}

        <h2>All Supervising Tasks</h2>
        <ul>
          {works && works.map((proj) => (
            <li key={proj._id}>
              <h3>{proj.name}</h3>
              <p>Assignment: {proj.assignment}</p>
              <p>Task Completed/Not: {proj.task}</p>
              <p>Description: {proj.description}</p>
              <button onClick={() => handleUpdate(proj._id)}>{isEditing === proj._id ? 'Edit' : 'Update'}</button>
              <button onClick={() => handleDelete(proj._id)}>Delete</button>
              {editingWork._id && isEditing && (
                <form className="project-form" onSubmit={handleUpdateSubmit}>
                  <label>
                    Name:
                    <input
                      type="text"
                      name="name"
                      value={editingWork.name}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label>
                    Assignment:
                    <input
                      type="text"
                      name="assignment"
                      value={editingWork.assignment}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label>
                    Task Completed/Not:
                    <input
                      type="text"
                      name="task"
                      value={editingWork.task}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label>
                    Description:
                    <textarea
                      name="description"
                      value={editingWork.description}
                      onChange={handleEditChange}
                    />
                  </label>
                  <button type="submit">Update Work</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Supervisor;
