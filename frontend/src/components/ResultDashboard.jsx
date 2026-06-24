import React, { useState } from 'react';
import { ShieldCheck, Flame, Compass, MapPin, Building, GraduationCap, ArrowRight } from 'lucide-react';

export default function ResultDashboard({ predictions, percentile, category }) {
  const [activeTab, setActiveTab] = useState('moderate');

  const tabs = [
    { id: 'safe', label: 'Safe Colleges', icon: ShieldCheck, color: 'text-emerald-400 border-emerald-400 bg-emerald-500/10' },
    { id: 'moderate', label: 'Moderate Colleges', icon: Compass, color: 'text-amber-400 border-amber-400 bg-amber-500/10' },
    { id: 'dream', label: 'Dream Colleges', icon: Flame, color: 'text-indigo-400 border-indigo-400 bg-indigo-500/10' },
  ];

  const currentList = predictions[activeTab] || [];

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* Header Info Banner */}
      <div className="glassmorphism p-6 rounded-2xl border border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-300">Admission Recommendations</h3>
          <p className="text-sm text-gray-400">Showing matches for category: <span className="text-white font-bold">{category}</span></p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 border border-gray-800 rounded-xl px-4 py-2 text-center">
            <span className="text-xs text-gray-400 block uppercase tracking-wider">Your Percentile</span>
            <span className="text-lg font-bold text-blue-400">{percentile}%</span>
          </div>
          <div className="bg-slate-900 border border-gray-800 rounded-xl px-4 py-2 text-center">
            <span className="text-xs text-gray-400 block uppercase tracking-wider">Total Options</span>
            <span className="text-lg font-bold text-white">
              {(predictions.safe?.length || 0) + (predictions.moderate?.length || 0) + (predictions.dream?.length || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="grid grid-cols-3 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = predictions[tab.id]?.length || 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold text-sm transition-all duration-200 cursor-pointer ${
                isActive
                  ? `${tab.color} border-current`
                  : 'bg-darkCard/40 border-gray-800 text-gray-400 hover:text-gray-200 hover:bg-darkCard/60'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-center">{tab.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/10' : 'bg-slate-800'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Cards List */}
      {currentList.length === 0 ? (
        <div className="glassmorphism p-12 text-center rounded-2xl border border-gray-800">
          <Compass className="h-12 w-12 mx-auto text-gray-500 mb-3 animate-pulse" />
          <h4 className="text-lg font-semibold text-gray-300">No colleges found in this category</h4>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
            Try adjusting your percentile or select a different category to broaden the predictions search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {currentList.map((cutoff, idx) => (
            <div
              key={cutoff.id || idx}
              className="glassmorphism glassmorphism-hover p-6 rounded-2xl flex flex-col justify-between border border-gray-800 relative overflow-hidden group"
            >
              {/* Card Color Bar Indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                activeTab === 'safe' ? 'bg-emerald-500' : activeTab === 'moderate' ? 'bg-amber-500' : 'bg-indigo-500'
              }`} />

              <div className="space-y-4">
                {/* College Meta */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-gray-800 font-mono text-gray-300">
                      Code {cutoff.college.code}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {cutoff.college.city}</span>
                  </div>
                  <h4 className="text-base font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                    {cutoff.college.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <Building className="h-3 w-3" />
                    <span>{cutoff.college.status}</span>
                  </div>
                </div>

                {/* Course Branch Meta */}
                <div className="bg-[#0e1320] border border-gray-800/40 rounded-xl p-3 flex items-start gap-2.5">
                  <GraduationCap className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[11px] text-gray-500 block font-mono">Branch Code: {cutoff.branchCode}</span>
                    <span className="text-sm font-semibold text-gray-200">{cutoff.branchName}</span>
                  </div>
                </div>
              </div>

              {/* Admission Cutoff Metrics */}
              <div className="flex items-center justify-between border-t border-gray-800/60 pt-4 mt-4">
                <div className="text-xs text-gray-400">
                  <span>CAP Round {cutoff.round} ({cutoff.year} Cutoff)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">Required:</span>
                  <span className={`text-base font-bold ${
                    activeTab === 'safe' ? 'text-emerald-400' : activeTab === 'moderate' ? 'text-amber-400' : 'text-indigo-400'
                  }`}>
                    {cutoff.cutoffPercentile}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
