import React, { useState } from 'react';
import { Search, Award, Users, AlertCircle } from 'lucide-react';

const CATEGORIES = ['OPEN', 'EWS', 'TFWS', 'OBC', 'SC', 'ST'];

export default function InputForm({ onSubmit, loading }) {
  const [percentile, setPercentile] = useState('');
  const [category, setCategory] = useState('OPEN');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const pct = parseFloat(percentile);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      setError('Please enter a valid percentile between 0 and 100.');
      return;
    }

    onSubmit({ percentile: pct, category });
  };

  return (
    <div className="glassmorphism p-8 rounded-2xl shadow-glass border border-gray-800 w-full max-w-xl mx-auto transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/20 rounded-xl text-primary">
          <Award className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-sans text-white">Find Your Match</h2>
          <p className="text-sm text-gray-400">Enter your score and category to predict colleges</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Percentile Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="percentile">
            MHT CET Percentile
          </label>
          <div className="relative">
            <input
              id="percentile"
              type="number"
              step="0.0001"
              min="0"
              max="100"
              placeholder="e.g. 99.8542"
              value={percentile}
              onChange={(e) => setPercentile(e.target.value)}
              className="w-full bg-[#0e1320] border border-gray-800 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-600 outline-none transition-all"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
              %
            </span>
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="category">
            Admission Category
          </label>
          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0e1320] border border-gray-800 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl py-3 px-4 text-white outline-none transition-all appearance-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-danger bg-danger/10 border border-danger/20 rounded-xl p-3 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 hover:shadow-blue-950/40 transition-all cursor-pointer"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Predict Colleges</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
