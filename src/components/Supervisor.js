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

  const [project, setProject] = useState({
    supervisorId: '',
    supervisorName: '',
    assignment: '',
    task_completed: '',
    description: '',
  });

  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [editingProject, setEditingProject] = useState({
    id: '',
    supervisorName: '',
    assignment: '',
    task_completed: '',
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
    const { name, value, files } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProject({ ...editingProject, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem('authToken');
      const formData = new FormData();

      formData.append('supervisorName', project.supervisorName);
      formData.append('supervisorId', authToken);
      formData.append('assignment', project.assignment);
      formData.append('task_completed', project.task_completed);
      formData.append('description', project.description);

      const response = await axios.post('http://localhost:4000/api/user/addSupervisor', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to add project');
      }

      const newProject = { ...project, id: Date.now() };
      setProjects([...projects, newProject]);
      setProject({ supervisorName: '', assignment: '', task_completed: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleUpdate = async (projectId) => {
    setIsEditing(projectId);
    try {
      const projectToUpdate = projects.find((proj) => proj._id === projectId); 
      console.log(projectToUpdate, "updated");
      setEditingProject({ ...projectToUpdate });
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };


  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const index = projects.findIndex((proj) => proj._id === editingProject._id);

      if (index !== -1) {
        setProjects((previous) => {
          const updatedProjects = [...previous]; 
          updatedProjects[index] = editingProject; 
          console.log(updatedProjects,"updated projects")
          return updatedProjects; 
        });
      } else {
        console.error("Project not found in the array.");
      }
      const authToken = localStorage.getItem('authToken');
      console.log(editingProject,"form");
      const response = await axios.patch(`http://localhost:4000/api/user/updateSupervisor/${editingProject._id}`, editingProject, {
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to update project');
      }

      setEditingProject({
        id: '',
        supervisorName: '',
        assignment: '',
        task_completed: '',
        description: '',
      });
      setIsEditing(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:4000/api/user/deleteSupervisor/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      setProjects(projects.filter((proj) => proj._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        const { data } = await axios.get('http://localhost:4000/api/user/getSupervisor', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log(data, "data fetched");
        setProjects(data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

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
              <input type="text" name="supervisorName" value={project.supervisorName} onChange={handleChange} />
            </label>
            <label>
              Assignment:
              <input type="text" name="assignment" value={project.assignment} onChange={handleChange} />
            </label>
            <label>
              Task completed/not:
              <input type="text" name="task_completed" value={project.task_completed} onChange={handleChange} />
            </label>
            <label>
              Description:
              <textarea name="description" value={project.description} onChange={handleChange} />
            </label>
            <button type="submit">Add Project</button>
          </form>
        )}

        <h2>All Supervising Tasks</h2>
        <ul>
          {projects && projects.map((proj) => (
            <li key={proj._id}>
              <h3>{proj.supervisorName}</h3>
              <p>Assignment: {proj.assignment}</p>
              <p>Task Completed/Not: {proj.task_completed}</p>
              <p>Description: {proj.description}</p>
              <button onClick={() => handleUpdate(proj._id)}>{isEditing === proj._id ? 'Edit' : 'Update'}</button>
              <button onClick={() => handleDelete(proj._id)}>Delete</button>
              {editingProject._id && (
                <form className="project-form" onSubmit={handleUpdateSubmit}>
                  <label>
                    Name:
                    <input
                      type="text"
                      name="supervisorName"
                      value={editingProject.supervisorName}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label>
                    Assignment:
                    <input
                      type="text"
                      name="assignment"
                      value={editingProject.assignment}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label>
                    Task Completed/Not:
                    <input
                      type="text"
                      name="task_completed"
                      value={editingProject.task_completed}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label>
                    Description:
                    <textarea
                      name="description"
                      value={editingProject.description}
                      onChange={handleEditChange}
                    />
                  </label>
                  <button type="submit">Update Project</button>
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
