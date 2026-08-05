import React from 'react';
import { useTruckStore } from '../../store/useTruckStore';
import { Scale, ArrowRight } from 'lucide-react';

export const ScaleTicketInput: React.FC = () => {
  const { catTicket, setCatTicket, applyCatTicketToTruck } = useTruckStore();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyCatTicketToTruck();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm mb-6">
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-3 mb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">CAT Scale Ticket Quick Loader</h2>
          <p className="text-xs text-slate-500">
            Have a physical scale ticket? Enter ticket values to instantly test against Federal Bridge Formula.
          </p>
        </div>
      </div>

      <form onSubmit={handleApply} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        {/* Steer Weight */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Steer Platform (lbs)</label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            step="100"
            value={catTicket.steerWeight}
            onChange={(e) => setCatTicket({ ...catTicket, steerWeight: Number(e.target.value) })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-base font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Drive Weight */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Drive Platform (lbs)</label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            step="100"
            value={catTicket.driveWeight}
            onChange={(e) => setCatTicket({ ...catTicket, driveWeight: Number(e.target.value) })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-base font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Trailer Weight */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Trailer Platform (lbs)</label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            step="100"
            value={catTicket.trailerWeight}
            onChange={(e) => setCatTicket({ ...catTicket, trailerWeight: Number(e.target.value) })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-base font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Apply Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-md shadow transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Apply Ticket Weights</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
