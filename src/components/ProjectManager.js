// ProjectManager.js

import React, { useState, useEffect } from 'react';
import './ProjectManager.css'; // Import the CSS file

const ProjectManager = () => {
  const [project, setProject] = useState({
    name: '',
    picture: '',
    location: '',
    price: '',
    description: '',
  });

  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (e.target.name === 'picture') {
        setProject({ ...project, picture: e.target.files[0] });
      } else {
        setProject({ ...project, [e.target.name]: e.target.value });
      }
    setProject({ ...project, [name]: value });


  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming your backend is running at http://localhost:3001
      const response = await fetch('http://localhost:4000/addproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        throw new Error('Failed to add project');
      }

      const newProject = { ...project, id: Date.now() };
      setProjects([...projects, newProject]);
      setProject({ name: '', picture: null, location: '', price: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding project:', error);
      // Handle error scenarios
    }
  };

  const handleUpdate = async (projectId) => {
    // Implement the update logic here using /updateproject API
    try {
      // Assuming your backend is running at http://localhost:3001
      const response = await fetch(`http://localhost:4000/updateproject/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // Provide updated data in the request body if needed
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      // Handle successful update on the frontend (if needed)
    } catch (error) {
      console.error('Error updating project:', error);
      // Handle error scenarios
    }
  };

  const handleDelete = async (projectId) => {
    // Implement the delete logic here using /deleteproject API
    try {
      // Assuming your backend is running at http://localhost:3001
      const response = await fetch(`http://localhost:4000/deleteproject/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      setProjects(projects.filter((proj) => proj.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      // Handle error scenarios
    }
  };

  useEffect(() => {
    // Fetch existing projects from the backend when the component mounts
    const fetchProjects = async () => {
      try {
        // Assuming your backend is running at http://localhost:3001
        const response = await fetch('http://localhost:4000/projects');

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Handle error scenarios
      }
    };

    fetchProjects();
  }, []); // Run this effect only once when the component mounts

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Project Manager</h1>
      </nav>

      <div className="project-manager-container">
        <h2>Add a new project</h2>
        <button className="add-project-button" onClick={toggleForm}>
          Add New Project
        </button>

        {showForm && (
          <form className="project-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" name="name" value={project.name} onChange={handleChange} />
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
          {projects.map((proj) => (
            <li key={proj.id}>
              <h3>{proj.name}</h3>
              {proj.picture && <img src={proj.picture instanceof Blob ? URL.createObjectURL(proj.picture) : proj.picture} alt={proj.name} />}
              <p>Location: {proj.location}</p>
              <p>Price: {proj.price}</p>
              <p>Description: {proj.description}</p>
              <button onClick={() => handleUpdate(proj.id)}>Update</button>
              <button onClick={() => handleDelete(proj.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectManager;
