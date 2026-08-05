import React, { useState, useRef, useEffect } from 'react';
import { Truck, Scale, MapPin, BookOpen, FileText, Menu, X, ShieldAlert, ChevronDown, ShieldCheck, Wrench, BarChart3, Database } from 'lucide-react';
import { useTruckStore, ActiveView } from '../store/useTruckStore';
import { STATE_REGULATIONS } from '../lib/data/states';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedStateSlug,
    selectState,
    setPrintModalOpen,
  } = useTruckStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedState = STATE_REGULATIONS.find(s => s.slug === selectedStateSlug) || STATE_REGULATIONS[0];

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isToolActive = ['cat-scale-decoder', 'pseo-matrix', 'tests', 'admin-seo-health', 'bridge-table-detail', 'truck-state-detail', 'legal-state-detail'].includes(activeView);

  return (
    <header className="bg-[#0a1317] text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-2.5 cursor-pointer shrink-0" onClick={() => handleNav('calculator')}>
            <div className="bg-[#0064e0] p-2 rounded-xl text-white shadow-sm shrink-0">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                DOT<span className="text-[#0091ff]">Weight</span>
              </span>
              <span className="text-[#0091ff] text-[10px] font-extrabold bg-[#0064e0]/15 px-2 py-0.5 rounded-full border border-[#0064e0]/30 uppercase tracking-wider">
                DOT
              </span>
            </div>
          </div>

          {/* Primary Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNav('calculator')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs lg:text-sm font-bold tracking-tight transition-all ${
                activeView === 'calculator'
                  ? 'bg-[#0064e0] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4 shrink-0 text-blue-400" />
              <span>Calculator</span>
            </button>

            <button
              onClick={() => handleNav('presets')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs lg:text-sm font-bold tracking-tight transition-all ${
                activeView === 'presets' || activeView === 'preset-detail'
                  ? 'bg-[#0064e0] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4 shrink-0 text-blue-400" />
              <span>Presets</span>
            </button>

            <button
              onClick={() => handleNav('states')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs lg:text-sm font-bold tracking-tight transition-all ${
                activeView === 'states' || activeView === 'state-detail'
                  ? 'bg-[#0064e0] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0 text-amber-400" />
              <span>50 State Rules</span>
            </button>

            <button
              onClick={() => handleNav('guides')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs lg:text-sm font-bold tracking-tight transition-all ${
                activeView === 'guides' || activeView === 'guide-detail'
                  ? 'bg-[#0064e0] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Guides</span>
            </button>

            {/* Secondary Tools Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs lg:text-sm font-bold tracking-tight transition-all ${
                  isToolActive
                    ? 'bg-[#0064e0] text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Wrench className="w-4 h-4 shrink-0 text-purple-400" />
                <span>More Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0f1b21] border border-slate-700/80 rounded-2xl shadow-xl py-2 z-50 text-slate-200 backdrop-blur-md">
                  <button
                    onClick={() => handleNav('cat-scale-decoder')}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold hover:bg-slate-800/80 transition-colors text-left"
                  >
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div>CAT Scale Decoder</div>
                      <div className="text-[10px] text-slate-400 font-normal">Ticket axle breakdown</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('pseo-matrix')}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold hover:bg-slate-800/80 transition-colors text-left"
                  >
                    <Database className="w-4 h-4 text-[#0091ff]" />
                    <div>
                      <div>pSEO Matrix Directory</div>
                      <div className="text-[10px] text-slate-400 font-normal">1,050+ state route pages</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('tests')}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold hover:bg-slate-800/80 transition-colors text-left"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <div>
                      <div>System Audit Suite</div>
                      <div className="text-[10px] text-slate-400 font-normal">Bridge B math test runner</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('admin-seo-health')}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold hover:bg-slate-800/80 transition-colors text-left border-t border-slate-800/80 pt-2"
                  >
                    <BarChart3 className="w-4 h-4 text-rose-400" />
                    <div>
                      <div>SEO Health Admin</div>
                      <div className="text-[10px] text-slate-400 font-normal">Sitemap & indexation audit</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Area: Compact State Selector & PDF Report CTA */}
          <div className="flex items-center space-x-2">
            {/* Quick State Selector Dropdown */}
            <div className="relative flex items-center">
              <MapPin className="w-3.5 h-3.5 text-[#0091ff] absolute left-2.5 pointer-events-none" />
              <select
                value={selectedStateSlug}
                onChange={(e) => selectState(e.target.value)}
                className="bg-slate-800/90 text-slate-200 text-xs rounded-full pl-7 pr-6 py-1.5 border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0064e0] font-semibold appearance-none cursor-pointer max-w-[130px] sm:max-w-[170px] truncate"
              >
                {STATE_REGULATIONS.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.abbreviation === 'US' ? '🏛️ Federal' : `📍 ${s.state} (${s.abbreviation})`}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>

            {/* Print Report Trigger Button */}
            <button
              onClick={() => setPrintModalOpen(true)}
              className="hidden lg:flex items-center space-x-1.5 bg-[#0064e0] hover:bg-[#0457cb] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow transition-all tracking-tight shrink-0"
              title="Print DOT Compliance Report"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Summary</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a1317] border-b border-slate-800 px-4 pt-2 pb-4 space-y-1.5">
          <div className="p-2.5 bg-slate-800/80 rounded-2xl text-xs text-slate-300 flex items-center justify-between mb-2">
            <span>Evaluating Jurisdiction:</span>
            <span className="font-bold text-[#0091ff]">{selectedState.state}</span>
          </div>

          <button
            onClick={() => handleNav('calculator')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs font-bold tracking-tight ${
              activeView === 'calculator' ? 'bg-[#0064e0] text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4 text-[#0091ff]" />
            <span>Interactive Calculator</span>
          </button>

          <button
            onClick={() => handleNav('presets')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs font-bold tracking-tight ${
              activeView === 'presets' || activeView === 'preset-detail' ? 'bg-[#0064e0] text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Truck className="w-4 h-4 text-[#0091ff]" />
            <span>Vehicle Presets</span>
          </button>

          <button
            onClick={() => handleNav('states')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs font-bold tracking-tight ${
              activeView === 'states' || activeView === 'state-detail' ? 'bg-[#0064e0] text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#0091ff]" />
            <span>50 State Regulations</span>
          </button>

          <button
            onClick={() => handleNav('guides')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs font-bold tracking-tight ${
              activeView === 'guides' || activeView === 'guide-detail' ? 'bg-[#0064e0] text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#0091ff]" />
            <span>Scale & Bridge Guides</span>
          </button>

          <button
            onClick={() => handleNav('cat-scale-decoder')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs font-bold tracking-tight ${
              activeView === 'cat-scale-decoder' ? 'bg-[#0064e0] text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>CAT Scale Ticket Decoder</span>
          </button>

          <button
            onClick={() => handleNav('pseo-matrix')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs font-bold tracking-tight ${
              activeView === 'pseo-matrix' ? 'bg-[#0064e0] text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-[#0091ff]" />
            <span>pSEO Route Directory</span>
          </button>

          <button
            onClick={() => handleNav('tests')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs font-bold tracking-tight ${
              activeView === 'tests' ? 'bg-[#0064e0] text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Bridge Formula B Audit</span>
          </button>

          <button
            onClick={() => {
              setPrintModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs font-bold tracking-tight bg-blue-900/40 text-blue-300 border border-blue-700/50"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Print / Save PDF Summary</span>
          </button>

          <button
            onClick={() => handleNav('legal')}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-full text-xs text-slate-400 hover:text-slate-200"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Legal Disclaimers & Terms</span>
          </button>
        </div>
      )}
    </header>
  );
};

