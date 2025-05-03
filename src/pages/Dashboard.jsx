import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper,
  TextField, Button, Select, MenuItem, InputLabel, FormControl,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Dashboard() {
  const { setToken, setCurrentUser, currentUser, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const fetchProjects = () => {
    fetch('http://localhost:5000/api/projects', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        if (data.length > 0) setSelectedProject(data[0].id);
      });
  };

  const fetchTasks = () => {
    if (!selectedProject) return;
    fetch(`http://localhost:5000/api/tasks/${selectedProject}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setTasks);
  };

  useEffect(() => { fetchProjects(); }, [token]);
  useEffect(() => { fetchTasks(); }, [selectedProject]);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newProjectName }),
    }).then(() => {
      setNewProjectName('');
      fetchProjects();
    });
  };

  const handleCreateTask = () => {
    const payload = { ...newTask, project_id: selectedProject };
    fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }).then(() => {
      setNewTask({ title: '', description: '', status: 'pending' });
      fetchTasks();
    });
  };

  const handleEditTask = (task) => setEditingTask(task);

  const handleUpdateTask = () => {
    fetch(`http://localhost:5000/api/tasks/${editingTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        completed_at: editingTask.status === 'completed' ? new Date() : null,
      }),
    }).then(() => {
      setEditingTask(null);
      fetchTasks();
    });
  };

  const handleDeleteTask = (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }).then(fetchTasks);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      </div>

      

      <FormControl className="mb-4 min-w-[200px] w-2xs">
        <InputLabel className='mb-4'>Select Project</InputLabel>
        <Select value={selectedProject || ''} onChange={e => setSelectedProject(e.target.value)}>
          {projects.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="mb-6">
        <h2>Add New Project</h2>
        <div className="flex gap-2">
          <TextField size="small" label="Project Name" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} />
          <Button onClick={handleCreateProject} variant="contained">Add</Button>
        </div>
      </div>

      <div className="mb-4">
        <h2>Add Task</h2>
        <div className="flex gap-2 flex-wrap">
          <TextField size="small" label="Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
          <TextField size="small" label="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
          <Select size="small" value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })}>
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
          <Button onClick={handleCreateTask} variant="contained">Add Task</Button>
        </div>
      </div>

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{new Date(task.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditTask(task)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDeleteTask(task.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingTask} onClose={() => setEditingTask(null)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editingTask?.title || ''}
            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            className="mb-2"
          />
          <TextField
            fullWidth
            label="Description"
            value={editingTask?.description || ''}
            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
            className="mb-2"
          />
          <Select
            fullWidth
            value={editingTask?.status || 'pending'}
            onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingTask(null)}>Cancel</Button>
          <Button onClick={handleUpdateTask} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}