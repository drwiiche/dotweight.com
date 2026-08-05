import React from 'react';
import { useTruckStore } from '../../store/useTruckStore';
import { 
  AlertTriangle, 
  Calculator, 
  Scale, 
  MapPin, 
  Table, 
  Truck, 
  BookOpen, 
  ArrowLeft 
} from 'lucide-react';

export const NotFoundView: React.FC = () => {
  const { setActiveView } = useTruckStore();

  const handleNavigate = (view: any, path: string) => {
    window.history.pushState({}, '', path);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4 sm:px-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl p-8 border stroke-slate-200 border-slate-200 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold uppercase tracking-wider rounded-full border border-amber-200">
            Error 404 — Route Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Page or Statute Route Not Found
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-base">
            The axle compliance URL or state regulation document you attempted to access may have moved, been renamed, or does not exist.
          </p>
        </div>

        <div>
          <button
            id="not-found-back-btn"
            onClick={() => handleNavigate('calculator', '/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to DOT Axle Calculator
          </button>
        </div>
      </div>

      {/* Suggested Quick Links Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span>Popular DOT Axle & Compliance Tools</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleNavigate('calculator', '/')}
            className="p-5 bg-white border border-slate-200 hover:border-blue-300 rounded-xl shadow-xs text-left group transition-all"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
              Bridge Formula Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Interactive 23 CFR § 658.17 Federal Bridge Formula B solver.
            </p>
          </button>

          <button
            onClick={() => handleNavigate('cat-scale-decoder', '/cat-scale-decoder')}
            className="p-5 bg-white border border-slate-200 hover:border-blue-300 rounded-xl shadow-xs text-left group transition-all"
          >
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
              CAT Scale Ticket Decoder
            </h3>
            <p className="text-xs text-slate-500">
              Parse Steer, Drive, and Trailer weights from scale tickets instantly.
            </p>
          </button>

          <button
            onClick={() => handleNavigate('states', '/legal-states')}
            className="p-5 bg-white border border-slate-200 hover:border-blue-300 rounded-xl shadow-xs text-left group transition-all"
          >
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
              50-State Regulations Directory
            </h3>
            <p className="text-xs text-slate-500">
              Check statutory limits, tolerances, and DOT permit contacts by state.
            </p>
          </button>

          <button
            onClick={() => handleNavigate('bridge-table-detail', '/bridge-table')}
            className="p-5 bg-white border border-slate-200 hover:border-blue-300 rounded-xl shadow-xs text-left group transition-all"
          >
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Table className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
              Bridge Formula B Lookup Table
            </h3>
            <p className="text-xs text-slate-500">
              Complete weight allowance chart for 2 to 9 axles spanning 8 to 60 ft.
            </p>
          </button>

          <button
            onClick={() => handleNavigate('presets', '/presets')}
            className="p-5 bg-white border border-slate-200 hover:border-blue-300 rounded-xl shadow-xs text-left group transition-all"
          >
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
              Commercial Truck Presets
            </h3>
            <p className="text-xs text-slate-500">
              53' Semis, Superdumps, Concrete Mixers, Flatbeds, & B-Trains.
            </p>
          </button>

          <button
            onClick={() => handleNavigate('guides', '/guides')}
            className="p-5 bg-white border border-slate-200 hover:border-blue-300 rounded-xl shadow-xs text-left group transition-all"
          >
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
              DOT Compliance Guides
            </h3>
            <p className="text-xs text-slate-500">
              Detailed breakdown of KPRA rules, APU exemptions, and bridge math.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
