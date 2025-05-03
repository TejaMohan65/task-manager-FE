import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      setCurrentUser({ email });
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    } else {
      alert(data.msg || 'Login failed');
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-2">Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full mb-2" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 w-full mb-2" />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 w-full">Login</button>
      <p className="mt-2 text-sm">Don't have an account? <a href="/signup" className="text-blue-600">Signup</a></p>
    </div>
  );
}