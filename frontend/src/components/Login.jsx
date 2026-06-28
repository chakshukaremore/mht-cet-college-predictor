import React, { useState } from 'react';
import { LogIn, Key, Mail, AlertCircle } from 'lucide-react';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (!response.ok) {
        const message = response.status === 401
          ? 'Invalid username/email or password.'
          : 'Failed to log in. Please check if the server is running.';
        throw new Error(message);
      }

      const user = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glassmorphism p-8 rounded-2xl shadow-glass border border-gray-800 w-full max-w-md mx-auto transition-all duration-300 animate-fade-in">
      <div className="text-center mb-6">
        <div className="h-12 w-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20 mx-auto mb-3">
          <LogIn className="h-6 w-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold font-sans text-white">Welcome Back</h2>
        <p className="text-sm text-gray-400 mt-1">Sign in to access college recommendations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username/Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="usernameOrEmail">
            Username or Email
          </label>
          <div className="relative">
            <input
              id="usernameOrEmail"
              type="text"
              placeholder="Enter your username or email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full bg-[#0e1320] border border-gray-800 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all"
              required
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Mail className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0e1320] border border-gray-800 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all"
              required
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Key className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>

        {/* Error Info Banner */}
        {error && (
          <div className="flex items-center gap-2 text-danger bg-danger/10 border border-danger/20 rounded-xl p-3 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Action */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span>Log In</span>
          )}
        </button>
      </form>

      {/* Toggle View */}
      <div className="text-center mt-6 text-sm text-gray-400">
        <span>Don't have an account? </span>
        <button
          onClick={onSwitchToRegister}
          className="text-primary hover:text-blue-400 font-semibold underline transition-colors cursor-pointer"
        >
          Register here
        </button>
      </div>
    </div>
  );
}
