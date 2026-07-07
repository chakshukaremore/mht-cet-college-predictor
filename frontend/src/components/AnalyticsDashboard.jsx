import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Award, MapPin, Building, AlertCircle } from 'lucide-react';

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

export default function AnalyticsDashboard({ colleges }) {
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [selectedCategory, setSelectedCategory] = useState('OPEN');
  
  const [cutoffs, setCutoffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch cutoffs when college changes
  useEffect(() => {
    const fetchCutoffs = async () => {
      if (!selectedCollegeId) return;
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`http://localhost:8080/api/colleges/${selectedCollegeId}/cutoffs`);
        if (!response.ok) {
          throw new Error('Failed to load cutoff stats from database.');
        }
        const data = await response.json();
        setCutoffs(data);
      } catch (err) {
        console.error(err);
        setError('Error loading college cutoffs. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchCutoffs();
  }, [selectedCollegeId]);

  const college = colleges.find(c => c.id.toString() === selectedCollegeId);

  // 1. Line Chart Data: Cutoff Trend (Round 1, selected Category and Branch across 3 Years)
  const getTrendData = () => {
    return [2022, 2023, 2024].map(year => {
      const record = cutoffs.find(
        c => c.year === year && c.branchName === selectedBranch && c.category === selectedCategory && c.round === 1
      );
      return {
        year,
        percentile: record ? record.cutoffPercentile : null
      };
    });
  };

  const trendData = getTrendData();
  const validTrendData = trendData.filter(d => d.percentile !== null);

  // 2. Bar Chart Data: Branch Popularity (Round 1, selected Category, Year 2024 across all branches)
  const getBranchPopularityData = () => {
    return BRANCHES.map(brName => {
      const record = cutoffs.find(
        c => c.year === 2024 && c.branchName === brName && c.category === selectedCategory && c.round === 1
      );
      return {
        branch: brName.split(' ')[0], // short name
        fullName: brName,
        percentile: record ? record.cutoffPercentile : null
      };
    }).filter(d => d.percentile !== null);
  };

  const branchData = getBranchPopularityData();

  // Chart layout calculations
  const chartHeight = 150;
  const trendChartWidth = 340;
  const branchChartWidth = 460;

  // Render Line Chart Coordinates
  const getLineCoordinates = () => {
    if (validTrendData.length < 2) return '';
    const minVal = Math.min(...validTrendData.map(d => d.percentile)) - 0.5;
    const maxVal = Math.max(...validTrendData.map(d => d.percentile)) + 0.5;

    return validTrendData.map((d, index) => {
      const x = 40 + index * ((trendChartWidth - 60) / (validTrendData.length - 1));
      const y = chartHeight - ((d.percentile - minVal) / (maxVal - minVal)) * (chartHeight - 40) - 20;
      return { x, y, val: d.percentile, year: d.year };
    });
  };

  const lineCoords = getLineCoordinates();

  // Render Bar Chart heights
  const getBarHeight = (val, min, max) => {
    if (val === null) return 0;
    return ((val - min) / (max - min)) * (chartHeight - 40);
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto animate-fade-in">
      
      {/* Selector Header */}
      <div className="glassmorphism p-6 rounded-2xl border border-gray-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-800/80 pb-4">
          <div className="p-2.5 bg-blue-600/20 rounded-xl text-blue-400">
            <BarChart2 className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Admission Analytics</h2>
            <p className="text-xs text-gray-400">Explore admission cutoffs, trends over years, and branch popularities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* College Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Select Institution</label>
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="w-full bg-[#0e1320] border border-gray-800 focus:border-primary/50 rounded-xl py-2.5 px-3 text-sm text-white outline-none cursor-pointer"
            >
              <option value="">Select a College</option>
              {colleges.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name.split(' (')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Selector (for Trend Chart) */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Select Branch (for trend tracking)</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-[#0e1320] border border-gray-800 focus:border-primary/50 rounded-xl py-2.5 px-3 text-sm text-white outline-none cursor-pointer"
            >
              {BRANCHES.map(br => (
                <option key={br} value={br}>{br}</option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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

      {loading && (
        <div className="glassmorphism p-12 rounded-2xl border border-gray-800 text-center flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Analyzing database cutoffs...</p>
        </div>
      )}

      {/* Analytics Dashboard Panels */}
      {!selectedCollegeId ? (
        <div className="glassmorphism p-12 text-center rounded-2xl border border-gray-800">
          <TrendingUp className="h-12 w-12 mx-auto text-gray-600 mb-3 animate-pulse" />
          <h4 className="text-base font-bold text-gray-300">Select a College to View Charts</h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
            Choose a college from the dropdown above to load interactive trend lines and branch popularity stats.
          </p>
        </div>
      ) : !loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Main Visualizations Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Panel 1: Cutoff Trend Line Chart */}
            <div className="glassmorphism p-6 rounded-2xl border border-gray-800 md:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  Cutoff Trend (CAP Round 1)
                </h3>
                <p className="text-xs text-gray-400 mb-4">{selectedBranch}</p>
              </div>

              {validTrendData.length < 2 ? (
                <div className="py-12 text-center text-xs text-gray-500">Not enough data to map trends.</div>
              ) : (
                <div className="flex justify-center">
                  <svg width={trendChartWidth} height={chartHeight} className="overflow-visible">
                    {/* Glow filter definition */}
                    <defs>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Grid lines */}
                    {[0, 0.5, 1].map((ratio, index) => {
                      const y = 20 + ratio * (chartHeight - 40);
                      return <line key={index} x1="30" y1={y} x2={trendChartWidth} y2={y} stroke="#1e293b" strokeDasharray="3,3" />;
                    })}

                    {/* Trend Line Path */}
                    <path
                      d={lineCoords.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      filter="url(#glow)"
                    />

                    {/* Data Points */}
                    {lineCoords.map((pt, idx) => (
                      <g key={idx} className="group/dot">
                        <circle cx={pt.x} cy={pt.y} r="5" fill="#3b82f6" stroke="#0b0f19" strokeWidth="2" />
                        <text
                          x={pt.x}
                          y={pt.y - 12}
                          fill="#93c5fd"
                          className="text-[9px] font-bold text-center opacity-0 group-hover/dot:opacity-100 transition-opacity"
                          textAnchor="middle"
                        >
                          {pt.val.toFixed(2)}%
                        </text>
                        <text x={pt.x} y={chartHeight + 15} fill="#94a3b8" className="text-[10px] font-semibold" textAnchor="middle">
                          {pt.year}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              )}
            </div>

            {/* Panel 2: Branch Popularity Bar Chart */}
            <div className="glassmorphism p-6 rounded-2xl border border-gray-800 md:col-span-3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-400" />
                  Branch Cutoffs (2024, CAP Round 1)
                </h3>
                <p className="text-xs text-gray-400 mb-4">Branch competitiveness in the latest round</p>
              </div>

              {branchData.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500">No branch cutoff details.</div>
              ) : (
                <div className="flex justify-center">
                  <svg width={branchChartWidth} height={chartHeight + 20} className="overflow-visible">
                    {/* Grid lines */}
                    {/* Scale values based on min and max cutoffs */}
                    {(() => {
                      const cutoffsList = branchData.map(d => d.percentile);
                      const min = Math.max(0, Math.min(...cutoffsList) - 1);
                      const max = 100;
                      const colWidth = (branchChartWidth - 60) / branchData.length;

                      return (
                        <>
                          {[0, 0.5, 1].map((ratio, index) => {
                            const y = 20 + ratio * (chartHeight - 40);
                            const labelVal = max - ratio * (max - min);
                            return (
                              <g key={index}>
                                <line x1="40" y1={y} x2={branchChartWidth} y2={y} stroke="#1e293b" strokeDasharray="3,3" />
                                <text x="32" y={y + 3} fill="#64748b" className="text-[9px] font-mono" textAnchor="end">
                                  {labelVal.toFixed(1)}%
                                </text>
                              </g>
                            );
                          })}

                          {/* Bars */}
                          {branchData.map((d, index) => {
                            const barWidth = 20;
                            const x = 50 + index * colWidth + colWidth / 2 - barWidth / 2;
                            const h = getBarHeight(d.percentile, min, max);
                            const y = chartHeight - 20 - h;

                            return (
                              <g key={d.branch} className="group/bar">
                                <rect
                                  x={x}
                                  y={y}
                                  width={barWidth}
                                  height={h}
                                  fill="url(#barGradient)"
                                  rx="2"
                                />
                                <text
                                  x={x + barWidth / 2}
                                  y={y - 6}
                                  fill="#a7f3d0"
                                  className="text-[9px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity"
                                  textAnchor="middle"
                                >
                                  {d.percentile.toFixed(2)}
                                </text>
                                <text
                                  x={x + barWidth / 2}
                                  y={chartHeight + 5}
                                  fill="#94a3b8"
                                  className="text-[8px] font-semibold font-mono"
                                  textAnchor="middle"
                                >
                                  {d.branch}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}

                    {/* Gradient Definitions */}
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
            </div>

          </div>

          {/* Details Banner Card */}
          <div className="lg:col-span-5 glassmorphism p-5 rounded-2xl border border-gray-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white leading-tight">{college?.name}</h4>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{college?.city}</span>
                <span>•</span>
                <Building className="h-3.5 w-3.5" />
                <span>{college?.status}</span>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-mono">DTE CODE</span>
              <span className="text-lg font-mono font-bold text-blue-400">{college?.code}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
