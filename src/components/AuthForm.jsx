import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_URL}/api/users`;

const AuthForm = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = mode === 'login' ? `${API_BASE}/login` : `${API_BASE}/signup`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'signup' ? { username, email, password } : { email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || data.message || 'Something went wrong');
        return;
      }

      onAuthSuccess(data.response.accessToken, data.response.email, data.response.id);
    } catch {
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black rounded-lg p-8 w-full max-w-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-6">
          <Heart size={32} className="fill-pink-500 text-pink-500 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-black">Happy Thoughts</h1>
        </div>

        <div className="flex mb-6 border-2 border-black rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 font-bold text-sm transition-colors ${mode === 'login' ? 'bg-pink-200 text-black' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2 font-bold text-sm transition-colors ${mode === 'signup' ? 'bg-pink-200 text-black' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-pink-500 text-gray-900"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-pink-500 text-gray-900"
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-pink-500 text-gray-900"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-pink-200 hover:bg-pink-300 text-black font-bold py-3 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
