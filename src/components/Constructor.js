import React, { useState, useEffect } from 'react';
import './Constructor.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Constructor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state.email;

    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(null);
    const [task, setTask] = useState({
        constructionName: '',
        assignment: '',
        price: '',
        description: '',
        startDate: '',
        dueDate: ''
    });
    const [editingTask, setEditingTask] = useState({
        _id: '',
        constructionName: '',
        assignment: '',
        price: '',
        description: '',
        startDate: '',
        dueDate: ''
    });
    const [errors, setErrors] = useState({
        constructionName: '',
        assignment: '',
        price: '',
        description: '',
        startDate: '',
        dueDate: ''
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
        setTask({ ...task, [name]: value });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingTask({ ...editingTask, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!task.constructionName.trim()) {
            newErrors.constructionName = 'Name is required';
        }

        if (!task.assignment.trim()) {
            newErrors.assignment = 'Location is required';
        }

        if (!task.price.trim()) {
            newErrors.price = 'Price is required';
        } else if (isNaN(task.price)) {
            newErrors.price = 'Price must be a number';
        }

        if (!task.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!task.startDate.trim()) {
            newErrors.startDate = 'Start Date is required';
        }
        if (!task.dueDate.trim()) {
            newErrors.dueDate = 'Due Date is required';
        }

        if (Object.keys(newErrors).length > 0) {
            alert("Enter all the fields correctly!")
            setErrors(newErrors);
            return;
        }

        try {
            const authToken = localStorage.getItem('authToken');

            const newConstructor = {
                constructionName: task.constructionName,
                assignment: task.assignment,
                price: task.price,
                description: task.description,
                startDate: task.startDate,
                dueDate: task.dueDate
            };

            const { data } = await axios.post('http://localhost:4000/api/user/addConstructor', newConstructor, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            });

            newConstructor._id = data.data._id;

            setTasks([...tasks, newConstructor]);
            setTask({
                constructionName: '',
                assignment: '',
                price: '',
                description: '',
                startDate: '',
                dueDate: ''
            });
            setShowForm(false);
            setIsEditing(null);
            setEditingTask({
                _id: '',
                constructionName: '',
                assignment: '',
                price: '',
                description: '',
                startDate: '',
                dueDate: ''
            });
            setErrors({
                constructionName: '',
                assignment: '',
                price: '',
                description: '',
                startDate: '',
                dueDate: ''
            });
        } catch (error) {
            alert("Try again later. Server error.")
            console.error('Error adding constructor:', error);
        }
    };

    const handleUpdate = async (taskId) => {
        setIsEditing(taskId);
        try {
            const taskToUpdate = tasks.find((proj) => proj._id === taskId);
            setEditingTask({ ...taskToUpdate });
        } catch (error) {
            console.error('Error updating constructor:', error);
            alert("Try again later. Server error.");
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            const index = tasks.findIndex((proj) => proj._id === editingTask._id);

            if (index !== -1) {
                setTasks((previous) => {
                    const updatedTasks = [...previous];
                    updatedTasks[index] = editingTask;
                    return updatedTasks;
                });
            } else {
                console.error("Constructor not found in the array.");
            }
            const authToken = localStorage.getItem('authToken');

            await axios.patch(`http://localhost:4000/api/user/updateConstructor/${editingTask._id}`, editingTask, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            });

            setEditingTask({
                _id: '',
                constructionName: '',
                assignment: '',
                price: '',
                description: '',
                startDate: '',
                dueDate: ''
            });
            setIsEditing(null);
        } catch (error) {
            console.error('Error updating constructor:', error);
            alert("Try again later. Server error.");
        }
    };

    const handleDelete = async (taskId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:4000/api/user/deleteConstructor/${taskId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            setTasks(tasks.filter((proj) => proj._id !== taskId));
        } catch (error) {
            console.error('Error deleting constructor:', error);
        }
    };

    useEffect(() => {
        const fetchConstructors = async () => {
            try {
                const authToken = localStorage.getItem('authToken');

                const { data } = await axios.get('http://localhost:4000/api/user/getConstructor', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                setTasks(data.data);

                const filteredProjects = data.data.filter(proj =>
                    proj.constructionName.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setTasks(filteredProjects);

            } catch (error) {
                console.error('Error fetching constructors:', error);
            }
        };

        fetchConstructors();
    }, [searchTerm]);
    useEffect(() => {
        const checkAuthToken = async () => {
            const authToken = localStorage.getItem('authToken');

            if (!authToken) {
                // If there's no token, navigate to the login page
                navigate('/');
                return;
            }
            // try {
            //   const response = await axios.get('http://localhost:4000/api/user/checkToken', {
            //     headers: {
            //       Authorization: `Bearer ${authToken}`,
            //     },
            //   });
            // } catch (error) {
            //   navigate('/');
            // }
        };

        checkAuthToken();
    }, [navigate]);
    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-left">
                    <p>Dream Home Reality</p>
                </div>
                <h1 className="navbar-usertype">Contractor</h1>

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
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <h2>Add a new task</h2>
                <button className="add-project-button" onClick={toggleForm}>
                    Add New Task
                </button>

                {showForm && (
                    <form className="project-form" onSubmit={handleSubmit}>
                        <label>
                            Construction Name:
                            <input type="text" name="constructionName" value={task.constructionName} onChange={handleChange} />
                            <span style={{ color: 'red' }}>{errors.constructionName}</span>
                        </label>
                        <label>
                            Assignment:
                            <input type="text" name="assignment" value={task.assignment} onChange={handleChange} />
                            <span style={{ color: 'red' }}>{errors.assignment}</span>

                        </label>
                        <label>
                            Price:
                            <input type="text" name="price" value={task.price} onChange={handleChange} />
                            <span style={{ color: 'red' }}>{errors.price}</span>

                        </label>
                        <label>
                            Description:
                            <textarea name="description" value={task.description} onChange={handleChange} />
                            <span style={{ color: 'red' }}>{errors.description}</span>

                        </label>
                        <label>
                            Start Date:
                            <input type="date" name="startDate" value={task.startDate} onChange={handleChange} />
                            <span style={{ color: 'red' }}>{errors.startDate}</span>

                        </label>
                        <label>
                            End Date:
                            <input type="date" name="dueDate" value={task.dueDate} onChange={handleChange} />
                            <span style={{ color: 'red' }}>{errors.dueDate}</span>

                        </label>
                        <button type="submit">Add Task</button>
                    </form>
                )}

                <h2>All Contractor Tasks</h2>
                <ul>
                    {tasks && tasks.map((proj) => (
                        <li key={proj._id}>
                            <h3>{proj.constructionName}</h3>
                            <p>Assignment: {proj.assignment}</p>
                            <p>Price: {proj.price}</p>
                            <p>Start Date: {proj.startDate}</p>
                            <p>End Date: {proj.endDate}</p>
                            <p>Description: {proj.description}</p>
                            <button onClick={() => handleUpdate(proj._id)}>{isEditing === proj._id ? 'Edit' : 'Update'}</button>
                            <button onClick={() => handleDelete(proj._id)}>Delete</button>
                            {isEditing === proj._id && isEditing && (
                                <form className="project-form" onSubmit={handleUpdateSubmit}>
                                    <label>
                                        Construction Name:
                                        <input
                                            type="text"
                                            name="constructionName"
                                            value={editingTask.constructionName}
                                            onChange={handleEditChange}
                                        />
                                    </label>
                                    <label>
                                        Assignment:
                                        <input
                                            type="text"
                                            name="assignment"
                                            value={editingTask.assignment}
                                            onChange={handleEditChange}
                                        />
                                    </label>
                                    <label>
                                        Price:
                                        <input
                                            type="text"
                                            name="price"
                                            value={editingTask.price}
                                            onChange={handleEditChange}
                                        />
                                    </label>
                                    <label>
                                        Description:
                                        <textarea
                                            name="description"
                                            value={editingTask.description}
                                            onChange={handleEditChange}
                                        />
                                    </label>
                                    <label>
                                        Start Date:
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={editingTask.startDate}
                                            onChange={handleEditChange}
                                        />
                                    </label>
                                    <label>
                                        End Date:
                                        <input
                                            type="date"
                                            name="dueDate"
                                            value={editingTask.dueDate}
                                            onChange={handleEditChange}
                                        />
                                    </label>
                                    <button type="submit">Update Task</button>
                                </form>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Constructor;
