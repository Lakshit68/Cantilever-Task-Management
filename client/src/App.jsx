import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useFirestore } from './context/FirestoreContext';
import Modal from './components/Modal';

// Authentication Component
const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { register, login, authError } = useAuth();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isRegistering) {
        await register(email, password);
        setMessage('Registration successful! You are now logged in.');
      } else {
        await login(email, password);
        setMessage('Login successful!');
      }
    } catch (error) {
      // Error is already set in authError context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isRegistering ? 'Register' : 'Login'}
        </h2>
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
            {authError}
          </div>
        )}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4" role="alert">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:underline text-sm"
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Task Management Component
const TaskManager = () => {
  const { currentUser, logout } = useAuth();
  const { tasks, firestoreError, addTask, updateTask, deleteTask } = useFirestore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'active'
  const [sort, setSort] = useState('newest'); // 'newest', 'oldest', 'alphabetical'
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'info', 'error'

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '') {
      showInfoModal('Task title cannot be empty.');
      return;
    }
    try {
      await addTask(newTaskTitle);
      setNewTaskTitle('');
      showInfoModal('Task added successfully!');
    } catch (error) {
      showErrorModal('Failed to add task: ' + error.message);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
    } catch (error) {
      showErrorModal('Failed to update task status: ' + error.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      showInfoModal('Task deleted successfully!');
    }
    catch (error) {
      showErrorModal('Failed to delete task: ' + error.message);
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const handleSaveEdit = async (id) => {
    if (editingTaskTitle.trim() === '') {
      showInfoModal('Task title cannot be empty.');
      return;
    }
    try {
      await updateTask(id, { title: editingTaskTitle });
      setEditingTaskId(null);
      setEditingTaskTitle('');
      showInfoModal('Task updated successfully!');
    } catch (error) {
      showErrorModal('Failed to update task: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };

  const showInfoModal = (message) => {
    setModalMessage(message);
    setModalType('info');
    setShowModal(true);
  };

  const showErrorModal = (message) => {
    setModalMessage(message);
    setModalType('error');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
    setModalType('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'newest') {
      return b.createdAt?.toDate() - a.createdAt?.toDate();
    }
    if (sort === 'oldest') {
      return a.createdAt?.toDate() - b.createdAt?.toDate();
    }
    if (sort === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 font-inter">
      <div className="container mx-auto p-6 bg-white rounded-2xl shadow-xl max-w-3xl">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0">Task Manager</h1>
          <div className="flex items-center space-x-4">
            {currentUser && currentUser.email && (
              <span className="text-gray-700 text-lg font-medium">Hello, {currentUser.email}</span>
            )}
            <button
              onClick={logout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300 shadow-md"
            >
              Logout
            </button>
          </div>
        </header>

        {firestoreError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
            {firestoreError}
          </div>
        )}

        {/* Add New Task */}
        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            className="flex-grow px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-md"
          >
            Add Task
          </button>
        </form>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex space-x-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-lg font-medium transition duration-300 ${filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-5 py-2 rounded-lg font-medium transition duration-300 ${filter === 'active' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-5 py-2 rounded-lg font-medium transition duration-300 ${filter === 'completed' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              Completed
            </button>
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="block appearance-none w-full bg-gray-200 border border-gray-300 text-gray-800 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 shadow-sm"
            >
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
              <option value="alphabetical">Sort by Alphabetical</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Task List */}
        {sortedTasks.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-10">No tasks found. Add a new task to get started!</p>
        ) : (
          <ul className="space-y-4">
            {sortedTasks.map(task => (
              <li
                key={task.id}
                className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow-md transition duration-200 border border-gray-100"
              >
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editingTaskTitle}
                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                    className="flex-grow px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg mr-2 w-full sm:w-auto"
                  />
                ) : (
                  <span
                    className={`flex-grow text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                  >
                    {task.title}
                  </span>
                )}
                <div className="flex items-center space-x-3 mt-3 sm:mt-0 sm:ml-auto">
                  {editingTaskId === task.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 text-sm shadow-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancelEdit()}
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-500 transition duration-300 text-sm shadow-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className={`px-4 py-2 rounded-lg font-semibold transition duration-300 text-sm shadow-sm ${task.completed ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                      >
                        {task.completed ? 'Undo' : 'Complete'}
                      </button>
                      <button
                        onClick={() => handleEditClick(task)}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition duration-300 text-sm shadow-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300 text-sm shadow-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* User ID Display */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-600 text-sm">
          Your User ID: <span className="font-mono text-gray-800 break-all">{currentUser?.uid || 'Not available'}</span>
        </div>
      </div>

      {/* Modal for messages */}
      <Modal
        show={showModal}
        message={modalMessage}
        type={modalType}
        onClose={closeModal}
      />
    </div>
  );
};

export default function App() {
  const { currentUser, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading authentication...</div>
      </div>
    );
  }

  return (
    <>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body {"{"}
          font-family: 'Inter', sans-serif;
        {"}"}
      </style>
      <script src="https://cdn.tailwindcss.com"></script>
      {currentUser && currentUser.uid ? <TaskManager /> : <AuthScreen />}
    </>
  );
}