import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultDashboard from './components/ResultDashboard';
import Login from './components/Login';
import Register from './components/Register';
import CollegeComparison from './components/CollegeComparison';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { ArrowLeft, BarChart2, LogOut, User as UserIcon, GitCompare, LayoutDashboard, Search } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  
  const [activeTab, setActiveTab] = useState('predictor'); // 'predictor', 'compare', 'analytics'
  const [collegesList, setCollegesList] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({ percentile: '', category: '' });
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState('');

  // Check user session and load colleges
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    const loadColleges = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/colleges');
        if (response.ok) {
          const data = await response.json();
          setCollegesList(data);
        }
      } catch (err) {
        console.error('Failed to load colleges: ', err);
      }
    };

    loadColleges();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setPredictions(null);
    setError('');
    setActiveTab('predictor');
  };

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
        <header className="flex flex-col md:flex-row items-center justify-between border-b border-gray-800/80 pb-6 mb-8 max-w-6xl mx-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
              <BarChart2 className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-sans tracking-wide text-white">MHT CET Recommendation System</h1>
              <span className="text-xs text-gray-400 block font-mono">Admission &amp; Cutoff Analytics</span>
            </div>
          </div>
          
          {currentUser && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Tab Selectors */}
              <div className="flex bg-slate-950/60 p-1 rounded-xl border border-gray-800/60">
                <button
                  onClick={() => { setActiveTab('predictor'); handleBack(); }}
                  className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'predictor' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Predictor</span>
                </button>
                <button
                  onClick={() => setActiveTab('compare')}
                  className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'compare' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  <span>Compare</span>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'analytics' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Analytics</span>
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-2 bg-slate-900 border border-gray-800 py-1.5 px-3 rounded-xl">
                <UserIcon className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-gray-300 font-semibold">{currentUser.username}</span>
              </div>
              
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 py-2 px-3.5 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </header>

        {/* Content Box */}
        <main className="max-w-6xl mx-auto flex flex-col justify-center min-h-[60vh]">
          {/* Unauthenticated View */}
          {!currentUser ? (
            <div className="space-y-8 py-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-white tracking-tight leading-none">
                  Predict Your College Admission Chances
                </h2>
                <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Register or login below to enter your scores and unlock the dashboard recommendation algorithm.
                </p>
              </div>
              {authView === 'login' ? (
                <Login
                  onLogin={handleLogin}
                  onSwitchToRegister={() => setAuthView('register')}
                />
              ) : (
                <Register
                  onRegisterSuccess={() => setAuthView('login')}
                  onSwitchToLogin={() => setAuthView('login')}
                />
              )}
            </div>
          ) : (
            /* Authenticated View */
            <div className="space-y-6">
              {error && (
                <div className="glassmorphism p-6 rounded-2xl border border-red-900/30 text-center max-w-lg mx-auto mb-6">
                  <span className="text-danger font-bold text-sm block mb-1">Server Connection Error</span>
                  <p className="text-xs text-gray-400 mb-4">{error}</p>
                  <button
                    onClick={handleBack}
                    className="bg-slate-900 hover:bg-slate-800 border border-gray-800 text-xs px-4 py-2 rounded-xl text-gray-300 font-semibold cursor-pointer"
                  >
                    Go Back
                  </button>
                </div>
              )}

              {/* Sub-Views Based on Nav Tab */}
              {activeTab === 'predictor' && (
                <>
                  {!predictions && !error ? (
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-center space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-white tracking-tight">
                          Welcome, {currentUser.username}!
                        </h2>
                        <p className="text-sm text-gray-400 max-w-xl mx-auto">
                          Fill in your MHT CET details below to calculate safe, moderate, and dream college branches.
                        </p>
                      </div>
                      <InputForm onSubmit={handlePredict} loading={loading} />
                    </div>
                  ) : predictions && !error ? (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex justify-start max-w-6xl mx-auto">
                        <button
                          onClick={handleBack}
                          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-gray-800 py-2 px-4 rounded-xl transition-all cursor-pointer"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          <span>Modify Search</span>
                        </button>
                      </div>
                      <ResultDashboard
                        predictions={predictions}
                        percentile={searchParams.percentile}
                        category={searchParams.category}
                      />
                    </div>
                  ) : null}
                </>
              )}

              {activeTab === 'compare' && (
                <CollegeComparison colleges={collegesList} />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsDashboard colleges={collegesList} />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer Area */}
      <footer className="border-t border-gray-900 py-6 text-center text-xs text-gray-500 z-10 bg-slate-950/20">
        <p>© 2026 MHT CET College Recommendation &amp; Admission Analytics System. All rights reserved.</p>
      </footer>
    </div>
  );
}
