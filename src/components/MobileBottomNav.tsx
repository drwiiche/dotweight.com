import React from 'react';
import { Scale, Truck, MapPin, BookOpen, FileText } from 'lucide-react';
import { useTruckStore } from '../store/useTruckStore';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, setPrintModalOpen } = useTruckStore();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a1317]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-5 gap-1 text-center">
        {/* Calc Tab */}
        <button
          onClick={() => setActiveView('calculator')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all ${
            activeView === 'calculator'
              ? 'text-[#0091ff] bg-slate-800/90 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight tracking-tight">Calculator</span>
        </button>

        {/* Presets Tab */}
        <button
          onClick={() => setActiveView('presets')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all ${
            activeView === 'presets' || activeView === 'preset-detail'
              ? 'text-[#0091ff] bg-slate-800/90 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight tracking-tight">Presets</span>
        </button>

        {/* States Tab */}
        <button
          onClick={() => setActiveView('states')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all ${
            activeView === 'states' || activeView === 'state-detail'
              ? 'text-[#0091ff] bg-slate-800/90 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight tracking-tight">50 States</span>
        </button>

        {/* Guides Tab */}
        <button
          onClick={() => setActiveView('guides')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all ${
            activeView === 'guides' || activeView === 'guide-detail'
              ? 'text-[#0091ff] bg-slate-800/90 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight tracking-tight">Guides</span>
        </button>

        {/* PDF Report Trigger */}
        <button
          onClick={() => setPrintModalOpen(true)}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-full text-amber-400 hover:text-amber-300 transition-all"
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight font-bold tracking-tight">PDF Report</span>
        </button>
      </div>
    </div>
  );
};
