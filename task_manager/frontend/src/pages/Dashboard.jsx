import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  
  // State for fetching tasks
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for creating a new task
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  // 1. Fetch Tasks automatically when the Dashboard first loads!
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/'); // Axios injects our JWT for us automatically!
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Create a new Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    try {
      // Send the Python Backend the exact JSON structure it expects
      await api.post('/tasks/', newTask);
      
      // Clear the form fields
      setNewTask({ title: '', description: '' });
      
      // Instantly refresh the screen with the newly created task from the DB!
      fetchTasks();
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  // 3. Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      // The Python backend will double-check that we are the owner!
      await api.delete(`/tasks/${taskId}`);
      
      // Update our React screen by filtering out the deleted task instantly
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Failed to delete task", error);
      alert("You cannot delete a task you don't own!");
    }
  };

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Top Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Welcome back, {user?.name}! 👋</h2>
          <p style={{ color: 'var(--text-muted)' }}>Here are your active tasks.</p>
        </div>
        <button 
          onClick={logout} 
          style={{ width: 'auto', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          Logout
        </button>
      </div>

      {/* Create Task Form */}
      <div className="glass-panel" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
        <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            style={{ marginBottom: 0, flex: '1 1 300px' }}
            required
          />
          <input 
            type="text" 
            placeholder="Details (Optional)" 
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            style={{ marginBottom: 0, flex: '1 1 300px' }}
          />
          <button type="submit" style={{ width: 'auto', flex: '0 1 auto' }}>
            Add Task
          </button>
        </form>
      </div>

      {/* Display List of Tasks */}
      {loading ? (
        <p>Loading your tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="glass-panel" style={{ maxWidth: '100%', textAlign: 'center', opacity: 0.7 }}>
          <p>No tasks yet. Create your first one above!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.map((task) => (
            <div key={task._id} className="glass-panel" style={{ maxWidth: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{task.description}</p>
                <small style={{ color: 'var(--border)', display: 'block', marginTop: '0.5rem' }}>
                  Created on: {new Date(task.createdAt).toLocaleDateString()}
                </small>
              </div>
              <button 
                onClick={() => handleDeleteTask(task._id)}
                style={{ width: 'auto', backgroundColor: 'var(--danger)', padding: '8px 16px' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}
