import React, { useState } from 'react';
import { UserPlus, User, Mail, Key, AlertCircle } from 'lucide-react';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || 'Registration failed. Check if username or email is already taken.';
        throw new Error(message);
      }

      setSuccess(true);
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
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
          <UserPlus className="h-6 w-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold font-sans text-white">Create Account</h2>
        <p className="text-sm text-gray-400 mt-1">Register to start predicting your admission chances</p>
      </div>

      {success ? (
        <div className="text-center py-8 space-y-3">
          <div className="text-emerald-400 font-bold text-lg">Registration Successful!</div>
          <p className="text-sm text-gray-400">Redirecting you to Login screen...</p>
          <div className="h-5 w-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0e1320] border border-gray-800 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <User className="h-4.5 w-4.5" />
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Choose a strong password"
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

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0e1320] border border-gray-800 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Key className="h-4.5 w-4.5" />
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-danger bg-danger/10 border border-danger/20 rounded-xl p-3 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>
      )}

      {/* Switch View */}
      {!success && (
        <div className="text-center mt-6 text-sm text-gray-400">
          <span>Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-primary hover:text-blue-400 font-semibold underline transition-colors cursor-pointer"
          >
            Log in here
          </button>
        </div>
      )}
    </div>
  );
}
