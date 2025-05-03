import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '', name: '', country: '' });
  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      alert('Signup successful! Please login.');
      navigate('/login');
    } else {
      alert(data.msg || 'Signup failed');
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-2">Signup</h2>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 w-full mb-2" />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border p-2 w-full mb-2" />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border p-2 w-full mb-2" />
      <input placeholder="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="border p-2 w-full mb-2" />
      <button onClick={handleSignup} className="bg-green-500 text-white p-2 w-full">Signup</button>
      <p className="mt-2 text-sm">Already have an account? <a href="/login" className="text-blue-600">Login</a></p>
    </div>
  );
}