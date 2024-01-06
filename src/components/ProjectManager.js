import React, { useState, useEffect } from 'react';
import './ProjectManager.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

const ProjectManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state.email;

  const [project, setProject] = useState({
    projectManagerId: '',
    projectName: '',
    picture: null,
    location: '',
    price: '',
    description: '',
  });

  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState({
    id: '',
    projectName: '',
    picture: null,
    location: '',
    price: '',
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

    if (name === 'picture') {
      setProject({ ...project, picture: files[0] });
    } else {
      setProject({ ...project, [name]: value });
    }
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

      formData.append('projectName', project.projectName);
      formData.append('projectManagerId', authToken);
      formData.append('picture', project.picture);
      formData.append('location', project.location);
      formData.append('price', project.price);
      formData.append('description', project.description);

      const response = await axios.post('http://localhost:4000/api/user/addProject', formData, {
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
      setProject({ projectName: '', picture: null, location: '', price: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleUpdate = async (projectId) => {
    try {
      const projectToUpdate = projects.find((proj) => proj._id === projectId); // Check the ID field
      setEditingProject({ ...projectToUpdate });
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };
  
  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem('authToken');
      const formData = new FormData();

      formData.append('projectName', editingProject.projectName);
      formData.append('picture', editingProject.picture);
      formData.append('location', editingProject.location);
      formData.append('price', editingProject.price);
      formData.append('description', editingProject.description);

      const response = await axios.put(`http://localhost:4000/api/user/updateProject/${editingProject.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to update project');
      }

      const updatedProjects = projects.map((proj) =>
        proj.id === editingProject.id ? { ...proj, ...editingProject } : proj
      );

      setProjects(updatedProjects);
      setEditingProject({
        id: '',
        projectName: '',
        picture: null,
        location: '',
        price: '',
        description: '',
      });
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:4000/api/user/deleteProject/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to delete project');
      }

      setProjects(projects.filter((proj) => proj.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
  
        const { data } = await axios.get('http://localhost:4000/api/user/getProject', {
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
        <h1 className="navbar-usertype">Project Manager</h1>

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
        <h2>Add a new project</h2>
        <button className="add-project-button" onClick={toggleForm}>
          Add New Project
        </button>

        {showForm && (
          <form className="project-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" name="projectName" value={project.projectName} onChange={handleChange} />
            </label>
            <label>
              Picture:
              <input
                type="file"
                name="picture"
                onChange={handleChange}
                accept="image/*"
              />
            </label>
            <label>
              Location:
              <input type="text" name="location" value={project.location} onChange={handleChange} />
            </label>
            <label>
              Price:
              <input type="text" name="price" value={project.price} onChange={handleChange} />
            </label>
            <label>
              Description:
              <textarea name="description" value={project.description} onChange={handleChange} />
            </label>
            <button type="submit">Add Project</button>
          </form>
        )}

        <h2>All Projects</h2>
        <ul>
          {projects && projects.map((proj) => (
            <li key={proj._id}>
              <h3>{proj.projectName}</h3>
              {proj.projectPic && <img src={proj.projectPic instanceof Blob ? URL.createObjectURL(proj.projectPic) : proj.projectPic} alt={proj.projectName} />}
              <p>Location: {proj.location}</p>
              <p>Price: {proj.price}</p>
              <p>Description: {proj.description}</p>
              <button onClick={() => handleUpdate(proj.id)}>Update</button>
              <button onClick={() => handleDelete(proj.id)}>Delete</button>
            </li>
          ))}
        </ul>

        {editingProject.id && (
          <form className="project-form" onSubmit={handleUpdateSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="projectName"
                value={editingProject.projectName}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Picture:
              <input
                type="file"
                name="picture"
                onChange={handleEditChange}
                accept="image/*"
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={editingProject.location}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Price:
              <input
                type="text"
                name="price"
                value={editingProject.price}
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
      </div>
    </div>
  );
};

export default ProjectManager;
