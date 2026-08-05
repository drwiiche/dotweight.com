import React, { useState } from 'react';
import { useTruckStore } from '../../store/useTruckStore';
import { STATE_REGULATIONS } from '../../lib/data/states';
import { MapPin, Search, Phone, ExternalLink, ShieldAlert, Scale, Check } from 'lucide-react';
import { AdSlot } from '../ads/AdSlot';

export const StatesView: React.FC = () => {
  const { activeView, activeStateSlug, openStateDetail, selectState, setActiveView } = useTruckStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'kpra' | 'high_gvw' | 'tolerances'>('all');

  const activeState = STATE_REGULATIONS.find(s => s.slug === activeStateSlug) || STATE_REGULATIONS[0];

  const handleSelectStateForCalc = (slug: string) => {
    selectState(slug);
    setActiveView('calculator');
  };

  const filteredStates = STATE_REGULATIONS.filter(s => {
    const matchesSearch = s.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.abbreviation.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterCategory === 'kpra') {
      return Boolean(s.kpraLimitFeet);
    }
    if (filterCategory === 'high_gvw') {
      return s.maxGVWStandardLbs > 80000;
    }
    if (filterCategory === 'tolerances') {
      return s.tolerancesAndExceptions.length > 0;
    }
    return true;
  });

  if (activeView === 'state-detail') {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => setActiveView('states')}
          className="text-xs font-bold text-[#0064e0] hover:text-[#0457cb] flex items-center space-x-1.5 tracking-tight transition-colors"
        >
          <span>← Back to 50 State Directory</span>
        </button>

        <div className="bg-white border border-[#dee3e9] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#dee3e9] pb-6">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-xs font-bold bg-[#f1f4f7] text-[#0064e0] px-3 py-1 rounded-full border border-[#dee3e9]">
                  {activeState.abbreviation}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1317] tracking-tight">
                  {activeState.state} DOT Weight Regulations
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Official statutory limits, KPRA restrictions, and oversize/overweight permit contact details.
              </p>
            </div>

            <button
              onClick={() => handleSelectStateForCalc(activeState.slug)}
              className="bg-[#0064e0] hover:bg-[#0457cb] text-white font-bold text-xs px-6 py-3 rounded-full shadow-sm transition-all flex items-center space-x-2 tracking-tight shrink-0"
            >
              <Scale className="w-4 h-4" />
              <span>Evaluate Truck in {activeState.state}</span>
            </button>
          </div>

          {/* Key Rule Summary Callout */}
          <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-[#0064e0]">
              <MapPin className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-tight">Key State Regulation Summary</h3>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-semibold">{activeState.keyRuleSummary}</p>
          </div>

          {/* Statutory Limits Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#f1f4f7] p-4 rounded-2xl border border-[#dee3e9] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-tight">Max Standard GVW</span>
              <span className="text-lg font-bold font-mono text-[#0064e0]">{activeState.maxGVWStandardLbs.toLocaleString()} lbs</span>
            </div>
            <div className="bg-[#f1f4f7] p-4 rounded-2xl border border-[#dee3e9] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-tight">Single Axle Limit</span>
              <span className="text-lg font-bold font-mono text-[#0064e0]">{activeState.singleAxleLimitLbs.toLocaleString()} lbs</span>
            </div>
            <div className="bg-[#f1f4f7] p-4 rounded-2xl border border-[#dee3e9] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-tight">Tandem Axle Limit</span>
              <span className="text-lg font-bold font-mono text-[#0064e0]">{activeState.tandemAxleLimitLbs.toLocaleString()} lbs</span>
            </div>
            <div className="bg-[#f1f4f7] p-4 rounded-2xl border border-[#dee3e9] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-tight">KPRA Distance Limit</span>
              <span className="text-lg font-bold font-mono text-[#0a1317]">{activeState.kpraLimitFeet ? `${activeState.kpraLimitFeet} ft` : 'None'}</span>
            </div>
          </div>

          {/* Tolerances & Exceptions */}
          {activeState.tolerancesAndExceptions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#0a1317] uppercase tracking-tight">State Tolerances & Exemption Rules</h3>
              <ul className="space-y-2 bg-[#f1f4f7] p-4 rounded-2xl border border-[#dee3e9]">
                {activeState.tolerancesAndExceptions.map((ex, i) => (
                  <li key={i} className="text-xs text-slate-800 font-medium flex items-start space-x-2">
                    <span className="text-[#0064e0] font-bold mt-0.5">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact & Permits */}
          <div className="pt-4 border-t border-[#dee3e9] flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
            <div className="flex items-center space-x-2 text-slate-700 font-medium">
              <Phone className="w-4 h-4 text-[#0064e0]" />
              <span>DOT Permits Office: <strong className="text-[#0a1317] font-bold">{activeState.dotPhone}</strong></span>
            </div>
            <a
              href={activeState.permitWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#f1f4f7] hover:bg-slate-200 text-[#0064e0] font-bold px-5 py-2.5 rounded-full border border-[#ced0d4] flex items-center space-x-2 transition-all tracking-tight"
            >
              <span>Official State Permit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <AdSlot placement="InLineResults" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1317] tracking-tight">
          50 State DOT Regulations & Weight Limits
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto tracking-tight font-medium">
          Comprehensive state-by-state variance rules, KPRA kingpin distance restrictions, permit contacts, and agricultural tolerances.
        </p>
      </div>

      {/* Filter Chips & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#dee3e9] p-3.5 rounded-2xl shadow-2xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search state or abbreviation (e.g. CA, Texas)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f1f4f7] border border-[#dee3e9] rounded-full pl-10 pr-4 py-2 text-xs text-[#0a1317] focus:outline-none focus:ring-2 focus:ring-[#0064e0] font-medium"
          />
        </div>

        {/* Filter Category Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterCategory === 'all'
                ? 'bg-[#0064e0] text-white shadow-2xs'
                : 'bg-[#f1f4f7] text-slate-700 hover:bg-slate-200 border border-[#dee3e9]'
            }`}
          >
            All States ({STATE_REGULATIONS.length})
          </button>
          <button
            onClick={() => setFilterCategory('kpra')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterCategory === 'kpra'
                ? 'bg-[#0064e0] text-white shadow-2xs'
                : 'bg-[#f1f4f7] text-slate-700 hover:bg-slate-200 border border-[#dee3e9]'
            }`}
          >
            KPRA Distance Restricted
          </button>
          <button
            onClick={() => setFilterCategory('high_gvw')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterCategory === 'high_gvw'
                ? 'bg-[#0064e0] text-white shadow-2xs'
                : 'bg-[#f1f4f7] text-slate-700 hover:bg-slate-200 border border-[#dee3e9]'
            }`}
          >
            &gt; 80k lbs GVW Allowed
          </button>
          <button
            onClick={() => setFilterCategory('tolerances')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterCategory === 'tolerances'
                ? 'bg-[#0064e0] text-white shadow-2xs'
                : 'bg-[#f1f4f7] text-slate-700 hover:bg-slate-200 border border-[#dee3e9]'
            }`}
          >
            State Tolerances
          </button>
        </div>
      </div>

      {/* States Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredStates.map((st) => (
          <div
            key={st.slug}
            onClick={() => openStateDetail(st.slug)}
            className="bg-white border border-[#dee3e9] hover:border-[#0064e0] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold bg-[#f1f4f7] text-[#0064e0] px-3 py-1 rounded-full border border-[#dee3e9] group-hover:bg-[#0064e0] group-hover:text-white transition-colors">
                  {st.abbreviation}
                </span>
                <span className="text-xs font-bold font-mono text-[#0a1317]">
                  {st.maxGVWStandardLbs.toLocaleString()} lbs
                </span>
              </div>
              
              <h2 className="text-base font-bold text-[#0a1317] tracking-tight group-hover:text-[#0064e0] transition-colors mb-1.5">
                {st.state}
              </h2>
              
              <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-medium">
                {st.keyRuleSummary}
              </p>

              {/* Specific Rule Indicators */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {st.kpraLimitFeet && (
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-md">
                    KPRA {st.kpraLimitFeet} ft
                  </span>
                )}
                {st.maxGVWStandardLbs > 80000 && (
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                    High GVW
                  </span>
                )}
                {st.tolerancesAndExceptions.length > 0 && (
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200/80 px-2 py-0.5 rounded-md">
                    {st.tolerancesAndExceptions.length} Tolerances
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#dee3e9] text-xs">
              <span className="font-bold text-[#0064e0] group-hover:underline tracking-tight">
                View Full Regulations →
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectStateForCalc(st.slug);
                }}
                className="bg-[#f1f4f7] hover:bg-[#0064e0] hover:text-white text-[#0a1317] px-3.5 py-1.5 rounded-full font-bold border border-[#ced0d4] transition-all text-xs tracking-tight shrink-0"
              >
                Select for Calc
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdSlot placement="InLineResults" />
    </div>
  );
};
