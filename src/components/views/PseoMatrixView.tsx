import React, { useState, useEffect } from 'react';
import { Search, Filter, Database, Table, Truck, Building2, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { useTruckStore } from '../../store/useTruckStore';
import { VEHICLE_PRESETS } from '../../lib/data/presets';
import { STATE_REGULATIONS } from '../../lib/data/states';
import { injectPseoMetadata } from '../../lib/pseo/schemaGenerator';

export function PseoMatrixView() {
  const { openTruckStatePermutation, openBridgeTablePermutation, openLegalStatePermutation, setActiveView } = useTruckStore();

  const [activeTab, setActiveTab] = useState<'trucks' | 'bridge' | 'legal'>('trucks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('');

  useEffect(() => {
    injectPseoMetadata({
      title: 'DOT Programmatic SEO Matrix & State Bridge Formula Index',
      description: 'Directory of 1,200+ programmatic DOT weight limit landing pages, vehicle state permutations, and Federal Bridge Formula calculation lookup tables.',
      breadcrumbs: [
        { name: 'Home', item: '/' },
        { name: 'Programmatic Matrix Index', item: '/pseo-matrix' },
      ],
    });
  }, []);

  // Filter trucks x states
  const filteredVehiclePermutations: { vehicle: (typeof VEHICLE_PRESETS)[0]; state: (typeof STATE_REGULATIONS)[0] }[] = [];
  
  VEHICLE_PRESETS.forEach((v) => {
    STATE_REGULATIONS.slice(0, 30).forEach((s) => {
      const text = `${v.name} ${s.state} ${v.category} ${s.abbreviation}`.toLowerCase();
      const matchesSearch = searchQuery === '' || text.includes(searchQuery.toLowerCase());
      const matchesState = selectedStateFilter === '' || s.slug === selectedStateFilter;
      if (matchesSearch && matchesState) {
        filteredVehiclePermutations.push({ vehicle: v, state: s });
      }
    });
  });

  // Filter bridge formula combinations
  const bridgeCombinations: { axles: number; spacing: number }[] = [];
  const axleOptions = [2, 3, 4, 5, 6, 7, 8];
  const spacingOptions = [10, 14, 18, 22, 28, 34, 40, 46, 51, 56];

  axleOptions.forEach((a) => {
    spacingOptions.forEach((s) => {
      const text = `${a} axles ${s} feet bridge formula`.toLowerCase();
      if (searchQuery === '' || text.includes(searchQuery.toLowerCase())) {
        bridgeCombinations.push({ axles: a, spacing: s });
      }
    });
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-[#0a1317]">
      {/* Hero Header */}
      <div className="bg-[#0a1317] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0064e0]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#0064e0]/20 border border-[#0064e0]/40 text-[#0091ff] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight">
            <Database className="w-3.5 h-3.5" />
            <span>1,200+ Route Permutation Directory</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Programmatic SEO Data Matrix & Lookup Engine
          </h1>
          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            Every permutation below renders unique statutory payloads, state legal citations, and precalculated interactive mini-visualizers designed for high-intent zero-volume long-tail trucker search queries.
          </p>

          {/* Direct CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('cat-scale-decoder')}
              className="bg-[#0064e0] hover:bg-[#0457cb] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all flex items-center space-x-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>CAT Scale Ticket Decoder Tool</span>
            </button>
            <button
              onClick={() => setActiveView('calculator')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all border border-white/20 flex items-center space-x-2"
            >
              <span>Main Live Calculator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#dee3e9] rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center space-x-2 bg-[#f1f4f7] p-1 rounded-full border border-[#dee3e9]">
            <button
              onClick={() => setActiveTab('trucks')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'trucks' ? 'bg-[#0064e0] text-white shadow-sm' : 'text-slate-600 hover:text-[#0a1317]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Trucks × States ({filteredVehiclePermutations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bridge')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'bridge' ? 'bg-[#0064e0] text-white shadow-sm' : 'text-slate-600 hover:text-[#0a1317]'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Bridge Tables ({bridgeCombinations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('legal')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'legal' ? 'bg-[#0064e0] text-white shadow-sm' : 'text-slate-600 hover:text-[#0a1317]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>State Legal Laws ({STATE_REGULATIONS.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter matrix routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f1f4f7] border border-[#dee3e9] rounded-full pl-9 pr-4 py-2 text-xs font-medium text-[#0a1317] focus:outline-none focus:ring-2 focus:ring-[#0064e0]"
            />
          </div>
        </div>

        {activeTab === 'trucks' && (
          <div className="flex items-center space-x-2 pt-2 border-t border-[#dee3e9]">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-600">Filter by State:</span>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="bg-[#f1f4f7] border border-[#dee3e9] rounded-xl text-xs font-bold px-3 py-1 text-[#0a1317]"
            >
              <option value="">All States</option>
              {STATE_REGULATIONS.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.state} ({s.abbreviation})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab Content Display */}

      {/* Tab 1: Trucks x States Permutations */}
      {activeTab === 'trucks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehiclePermutations.slice(0, 60).map((item, idx) => (
            <div
              key={`${item.vehicle.slug}-${item.state.slug}-${idx}`}
              onClick={() => openTruckStatePermutation(item.vehicle.slug, item.state.slug)}
              className="p-4 bg-white border border-[#dee3e9] hover:border-[#0064e0] rounded-2xl shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-[#0064e0] bg-[#0064e0]/10 px-2.5 py-0.5 rounded-full uppercase tracking-tight">
                    {item.state.abbreviation} • {item.state.state}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">/trucks/{item.vehicle.slug}/{item.state.slug}</span>
                </div>
                <h3 className="font-bold text-[#0a1317] text-xs group-hover:text-[#0064e0] transition-colors leading-snug">
                  {item.vehicle.name} Limit in {item.state.state}
                </h3>
              </div>

              <div className="mt-3 pt-2 border-t border-[#f1f4f7] flex items-center justify-between text-[11px] font-bold text-[#0064e0]">
                <span>{item.state.maxGVWStandardLbs.toLocaleString()} lbs Max GVW</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Bridge Formula Lookup Tables */}
      {activeTab === 'bridge' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bridgeCombinations.map((comb, idx) => (
            <div
              key={`${comb.axles}-${comb.spacing}-${idx}`}
              onClick={() => openBridgeTablePermutation(comb.axles, comb.spacing)}
              className="p-4 bg-white border border-[#dee3e9] hover:border-[#0064e0] rounded-2xl shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-[#0064e0] bg-[#0064e0]/10 px-2.5 py-0.5 rounded-full uppercase tracking-tight">
                    Bridge Table
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">/bridge-table/{comb.axles}-axles-{comb.spacing}-ft</span>
                </div>
                <h3 className="font-bold text-[#0a1317] text-xs group-hover:text-[#0064e0] transition-colors">
                  {comb.axles} Axles with {comb.spacing} Feet Spacing
                </h3>
              </div>

              <div className="mt-3 pt-2 border-t border-[#f1f4f7] flex items-center justify-between text-[11px] font-bold text-[#0064e0]">
                <span>View Exact Formula Table</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: State Legal Overviews */}
      {activeTab === 'legal' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATE_REGULATIONS.filter((s) => searchQuery === '' || s.state.toLowerCase().includes(searchQuery.toLowerCase())).map((st) => (
            <div
              key={st.slug}
              onClick={() => openLegalStatePermutation(st.slug)}
              className="p-4 bg-white border border-[#dee3e9] hover:border-[#0064e0] rounded-2xl shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-[#0064e0] bg-[#0064e0]/10 px-2.5 py-0.5 rounded-full uppercase tracking-tight">
                    {st.abbreviation} Statutory Law
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">/legal/{st.slug}</span>
                </div>
                <h3 className="font-bold text-[#0a1317] text-xs group-hover:text-[#0064e0] transition-colors">
                  {st.state} DOT Weight Laws & Permits
                </h3>
              </div>

              <div className="mt-3 pt-2 border-t border-[#f1f4f7] flex items-center justify-between text-[11px] font-bold text-[#0064e0]">
                <span>{st.maxGVWStandardLbs.toLocaleString()} lbs Max GVW</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
