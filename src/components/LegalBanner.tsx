import React, { useState } from 'react';
import { ShieldAlert, X, ExternalLink } from 'lucide-react';
import { useTruckStore } from '../store/useTruckStore';

export const LegalBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { openLegalTab } = useTruckStore();

  if (dismissed) return null;

  return (
    <div className="fixed bottom-[52px] md:bottom-0 inset-x-0 bg-[#0a1317]/95 backdrop-blur-md border-t border-[#ced0d4]/20 z-30 px-3 sm:px-4 py-2 text-xs text-slate-300 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="p-1 bg-amber-500/20 text-amber-400 rounded-full shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <p className="truncate sm:whitespace-normal tracking-tight">
            <span className="font-bold text-amber-300">DOT Disclaimer:</span> Calculations are estimations based on Federal Bridge Formula B. Federal and state weigh stations remain final authority.{' '}
            <button
              onClick={() => openLegalTab('disclaimer')}
              className="underline text-[#0091ff] hover:text-[#0064e0] font-bold ml-1 inline-flex items-center"
            >
              Read full legal terms <ExternalLink className="w-3 h-3 ml-0.5" />
            </button>
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 shrink-0"
          title="Dismiss banner"
          aria-label="Dismiss disclaimer banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
