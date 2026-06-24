import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDashboard from './components/ResultDashboard';
import { ArrowLeft, RefreshCw, BarChart2 } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({ percentile: '', category: '' });
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState('');

  const handlePredict = async ({ percentile, category }) => {
    setLoading(true);
    setError('');
    setSearchParams({ percentile, category });

    try {
      const response = await fetch('http://localhost:8080/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ percentile, category }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch predictions from server. Make sure the Spring Boot backend is running.');
      }

      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setPredictions(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-darkBg text-gray-100 flex flex-col justify-between selection:bg-blue-600/30 selection:text-white">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="flex-grow container mx-auto px-4 py-8 z-10">
        
        {/* Navigation Header */}
        <header className="flex items-center justify-between border-b border-gray-800/80 pb-6 mb-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
              <BarChart2 className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-sans tracking-wide text-white">MHT CET Recommendation System</h1>
              <span className="text-xs text-gray-400 block font-mono">Admission &amp; Cutoff Analytics</span>
            </div>
          </div>
          {predictions && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-gray-800 py-2 px-4 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Modify Details</span>
            </button>
          )}
        </header>

        {/* Content Box */}
        <main className="max-w-6xl mx-auto flex flex-col justify-center min-h-[60vh]">
          {error && (
            <div className="glassmorphism p-6 rounded-2xl border border-red-900/30 text-center max-w-lg mx-auto mb-6">
              <span className="text-danger font-bold text-sm block mb-1">Server Error Connection</span>
              <p className="text-xs text-gray-400 mb-4">{error}</p>
              <button
                onClick={handleBack}
                className="bg-slate-900 hover:bg-slate-800 border border-gray-800 text-xs px-4 py-2 rounded-xl text-gray-300 font-semibold cursor-pointer"
              >
                Go Back
              </button>
            </div>
          )}

          {!predictions && !error ? (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-white tracking-tight leading-none">
                  Predict Your College Admission Chances
                </h2>
                <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Enter your MHT CET percentile and reservation category. Our algorithm maps historical cutoff thresholds and classfies your admission probability into Safe, Moderate, and Dream buckets.
                </p>
              </div>
              <InputForm onSubmit={handlePredict} loading={loading} />
            </div>
          ) : predictions && !error ? (
            <ResultDashboard
              predictions={predictions}
              percentile={searchParams.percentile}
              category={searchParams.category}
            />
          ) : null}
        </main>
      </div>

      {/* Footer Area */}
      <footer className="border-t border-gray-900 py-6 text-center text-xs text-gray-500 z-10 bg-slate-950/20">
        <p>© 2026 MHT CET College Recommendation &amp; Admission Analytics System. All rights reserved.</p>
      </footer>
    </div>
  );
}
