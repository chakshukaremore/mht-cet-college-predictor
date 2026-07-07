import React, { useState, useEffect } from 'react';
import { GitCompare, MapPin, Building, GraduationCap, AlertCircle, ArrowRight } from 'lucide-react';

const CATEGORIES = ['OPEN', 'EWS', 'TFWS', 'OBC', 'SC', 'ST'];
const BRANCHES = [
  'Computer Engineering',
  'Information Technology',
  'Artificial Intelligence and Data Science',
  'Electronics and Telecommunication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering'
];

export default function CollegeComparison({ colleges }) {
  const [collegeAId, setCollegeAId] = useState('');
  const [collegeBId, setCollegeBId] = useState('');
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [category, setCategory] = useState('OPEN');
  
  const [cutoffsA, setCutoffsA] = useState([]);
  const [cutoffsB, setCutoffsB] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch cutoffs when college selections change
  useEffect(() => {
    const fetchCutoffs = async () => {
      if (!collegeAId || !collegeBId) return;
      setLoading(true);
      setError('');

      try {
        const [resA, resB] = await Promise.all([
          fetch(`http://localhost:8080/api/colleges/${collegeAId}/cutoffs`),
          fetch(`http://localhost:8080/api/colleges/${collegeBId}/cutoffs`)
        ]);

        if (!resA.ok || !resB.ok) {
          throw new Error('Failed to fetch cutoff details from the server.');
        }

        const dataA = await resA.json();
        const dataB = await resB.json();

        setCutoffsA(dataA);
        setCutoffsB(dataB);
      } catch (err) {
        console.error(err);
        setError('Error fetching comparison data. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchCutoffs();
  }, [collegeAId, collegeBId]);

  const collegeA = colleges.find(c => c.id.toString() === collegeAId);
  const collegeB = colleges.find(c => c.id.toString() === collegeBId);

  // Filter cutoffs for specific branch, category, Round 1 across years
  const getCutoffForYear = (cutoffList, year) => {
    return cutoffList.find(
      c => c.branchName === branch && c.category === category && c.year === year && c.round === 1
    );
  };

  const cutoffsYearly = [2022, 2023, 2024].map(year => {
    const cutA = getCutoffForYear(cutoffsA, year);
    const cutB = getCutoffForYear(cutoffsB, year);
    return {
      year,
      valA: cutA ? cutA.cutoffPercentile : null,
      valB: cutB ? cutB.cutoffPercentile : null,
    };
  });

  // Calculate comparison summary
  const validYears = cutoffsYearly.filter(d => d.valA !== null && d.valB !== null);
  const averageDelta = validYears.length > 0 
    ? (validYears.reduce((sum, d) => sum + (d.valA - d.valB), 0) / validYears.length).toFixed(4)
    : null;

  // Chart rendering parameters
  const chartHeight = 160;
  const chartWidth = 320;
  const minVal = validYears.length > 0
    ? Math.max(0, Math.min(...validYears.flatMap(d => [d.valA, d.valB])) - 1)
    : 90;
  const maxVal = 100;
  
  const getBarHeight = (val) => {
    if (val === null) return 0;
    return ((val - minVal) / (maxVal - minVal)) * chartHeight;
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto animate-fade-in">
      
      {/* College Comparison Selector Header */}
      <div className="glassmorphism p-6 rounded-2xl border border-gray-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-800/80 pb-4">
          <div className="p-2.5 bg-blue-600/20 rounded-xl text-blue-400">
            <GitCompare className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Compare Colleges</h2>
            <p className="text-xs text-gray-400">Select two colleges and a branch to compare historical cutoff trends</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* College A Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">College A</label>
            <select
              value={collegeAId}
              onChange={(e) => setCollegeAId(e.target.value)}
              className="w-full bg-[#0e1320] border border-gray-800 focus:border-primary/50 rounded-xl py-2.5 px-3 text-sm text-white outline-none cursor-pointer"
            >
              <option value="">Select College A</option>
              {colleges.map(c => (
                <option key={c.id} value={c.id} disabled={c.id.toString() === collegeBId}>
                  {c.code} - {c.name.split(' (')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* College B Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">College B</label>
            <select
              value={collegeBId}
              onChange={(e) => setCollegeBId(e.target.value)}
              className="w-full bg-[#0e1320] border border-gray-800 focus:border-primary/50 rounded-xl py-2.5 px-3 text-sm text-white outline-none cursor-pointer"
            >
              <option value="">Select College B</option>
              {colleges.map(c => (
                <option key={c.id} value={c.id} disabled={c.id.toString() === collegeAId}>
                  {c.code} - {c.name.split(' (')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Branch</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-[#0e1320] border border-gray-800 focus:border-primary/50 rounded-xl py-2.5 px-3 text-sm text-white outline-none cursor-pointer"
            >
              {BRANCHES.map(br => (
                <option key={br} value={br}>{br}</option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0e1320] border border-gray-800 focus:border-primary/50 rounded-xl py-2.5 px-3 text-sm text-white outline-none cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-danger bg-danger/10 border border-danger/20 rounded-xl p-4 text-sm max-w-lg mx-auto">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Comparison Loading Screen */}
      {loading && (
        <div className="glassmorphism p-12 rounded-2xl border border-gray-800 text-center flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Fetching comparison stats...</p>
        </div>
      )}

      {/* Comparison Dashboard Results */}
      {!collegeAId || !collegeBId ? (
        <div className="glassmorphism p-12 text-center rounded-2xl border border-gray-800">
          <GitCompare className="h-12 w-12 mx-auto text-gray-600 mb-3 animate-pulse" />
          <h4 className="text-base font-bold text-gray-300">Select Colleges to Compare</h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
            Choose College A, College B, and a desired engineering stream to unlock side-by-side cutoff analytics.
          </p>
        </div>
      ) : !loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metadata Cards */}
          <div className="space-y-4 lg:col-span-1">
            {/* College A Details */}
            <div className="glassmorphism p-5 rounded-2xl border-l-4 border-l-blue-500 border-gray-800">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono font-bold border border-blue-500/20">COLLEGE A</span>
              <h4 className="text-base font-bold text-white mt-2 leading-tight">{collegeA?.name}</h4>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{collegeA?.city}</span>
                <span>•</span>
                <Building className="h-3.5 w-3.5" />
                <span>{collegeA?.status}</span>
              </div>
            </div>

            {/* College B Details */}
            <div className="glassmorphism p-5 rounded-2xl border-l-4 border-l-emerald-500 border-gray-800">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">COLLEGE B</span>
              <h4 className="text-base font-bold text-white mt-2 leading-tight">{collegeB?.name}</h4>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{collegeB?.city}</span>
                <span>•</span>
                <Building className="h-3.5 w-3.5" />
                <span>{collegeB?.status}</span>
              </div>
            </div>

            {/* Competitive Analysis Summary Card */}
            {averageDelta !== null && (
              <div className="glassmorphism p-5 rounded-2xl border border-gray-800 bg-[#0e1320]/60 space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Competitive Analysis</h4>
                <p className="text-sm text-gray-300 leading-snug">
                  On average, <span className="text-white font-bold">{collegeA?.name.split(' (')[0]}</span> is{' '}
                  <span className={`font-bold ${parseFloat(averageDelta) >= 0 ? 'text-blue-400' : 'text-emerald-400'}`}>
                    {Math.abs(parseFloat(averageDelta))}%
                  </span>{' '}
                  {parseFloat(averageDelta) >= 0 ? 'harder' : 'easier'} to get into than{' '}
                  <span className="text-white font-bold">{collegeB?.name.split(' (')[0]}</span> for the selected branch.
                </p>
              </div>
            )}
          </div>

          {/* Graphical Visualization (Custom SVG Chart) */}
          <div className="glassmorphism p-6 rounded-2xl border border-gray-800 lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
                Cutoff Comparison (CAP Round 1)
              </h3>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around gap-6">
              {/* Custom SVG Side-by-Side Bar Chart */}
              <div className="relative">
                <svg width={chartWidth} height={chartHeight + 30} className="overflow-visible">
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                    const y = chartHeight - ratio * chartHeight;
                    const val = minVal + ratio * (maxVal - minVal);
                    return (
                      <g key={index}>
                        <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="#1e293b" strokeDasharray="3,3" />
                        <text x="-8" y={y + 4} fill="#64748b" className="text-[10px] text-right font-mono" textAnchor="end">
                          {val.toFixed(1)}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Yearly Side-by-Side Bars */}
                  {cutoffsYearly.map((data, yearIdx) => {
                    const groupWidth = chartWidth / 3;
                    const xCenter = yearIdx * groupWidth + groupWidth / 2;
                    
                    const barWidth = 24;
                    const barHeightA = getBarHeight(data.valA);
                    const barHeightB = getBarHeight(data.valB);

                    return (
                      <g key={data.year}>
                        {/* College A Bar (Blue) */}
                        {data.valA && (
                          <g className="group/bar">
                            <rect
                              x={xCenter - barWidth - 2}
                              y={chartHeight - barHeightA}
                              width={barWidth}
                              height={barHeightA}
                              fill="url(#blueGradient)"
                              rx="3"
                              className="transition-all duration-300"
                            />
                            <text
                              x={xCenter - barWidth/2 - 2}
                              y={chartHeight - barHeightA - 6}
                              fill="#60a5fa"
                              className="text-[9px] font-bold text-center opacity-0 group-hover/bar:opacity-100 transition-opacity"
                              textAnchor="middle"
                            >
                              {data.valA.toFixed(2)}
                            </text>
                          </g>
                        )}

                        {/* College B Bar (Emerald) */}
                        {data.valB && (
                          <g className="group/bar">
                            <rect
                              x={xCenter + 2}
                              y={chartHeight - barHeightB}
                              width={barWidth}
                              height={barHeightB}
                              fill="url(#emeraldGradient)"
                              rx="3"
                              className="transition-all duration-300"
                            />
                            <text
                              x={xCenter + barWidth/2 + 2}
                              y={chartHeight - barHeightB - 6}
                              fill="#34d399"
                              className="text-[9px] font-bold text-center opacity-0 group-hover/bar:opacity-100 transition-opacity"
                              textAnchor="middle"
                            >
                              {data.valB.toFixed(2)}
                            </text>
                          </g>
                        )}

                        {/* Year Label */}
                        <text x={xCenter} y={chartHeight + 18} fill="#94a3b8" className="text-xs font-semibold" textAnchor="middle">
                          {data.year}
                        </text>
                      </g>
                    );
                  })}

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#047857" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Legend and Stats Panel */}
              <div className="space-y-4 self-center bg-slate-950/40 border border-gray-800/40 p-4 rounded-xl shrink-0 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-blue-500 rounded" />
                  <span className="text-xs font-semibold text-gray-300">College A (Blue)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-emerald-500 rounded" />
                  <span className="text-xs font-semibold text-gray-300">College B (Green)</span>
                </div>
                <div className="border-t border-gray-800/60 pt-2 mt-2 text-xs text-gray-400">
                  <span>CAP Round 1 baseline comparison values shown.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
