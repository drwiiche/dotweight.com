import React from 'react';
import { useTruckStore } from '../../store/useTruckStore';
import { VEHICLE_PRESETS } from '../../lib/data/presets';
import { Truck, Scale, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AdSlot } from '../ads/AdSlot';

export const PresetsView: React.FC = () => {
  const { activeView, activePresetSlug, openPresetDetail, selectPreset, setActiveView } = useTruckStore();

  const activePreset = VEHICLE_PRESETS.find(p => p.slug === activePresetSlug) || VEHICLE_PRESETS[0];

  const handleLoadAndCalculate = (presetId: string) => {
    selectPreset(presetId);
    setActiveView('calculator');
  };

  if (activeView === 'preset-detail') {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => setActiveView('presets')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          ← Back to All Vehicle Presets
        </button>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{activePreset.category}</span>
              <h1 className="text-2xl font-bold text-slate-900">{activePreset.name}</h1>
            </div>
            <button
              onClick={() => handleLoadAndCalculate(activePreset.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-md shadow transition-colors flex items-center space-x-2"
            >
              <span>Load Preset in Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">{activePreset.description}</p>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-1">Typical Operating Use Cases</h3>
            <p className="text-xs text-slate-800">{activePreset.typicalUse}</p>
          </div>

          {/* Preset Axles Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Pre-Configured Axles & Weights</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Axle #</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Group</th>
                    <th className="p-3">Standard Weight</th>
                    <th className="p-3">Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activePreset.axles.map((ax, i) => (
                    <tr key={ax.id}>
                      <td className="p-3 font-bold text-blue-600">Axle #{i + 1}</td>
                      <td className="p-3 font-semibold text-slate-900">{ax.name}</td>
                      <td className="p-3 uppercase">{ax.groupName}</td>
                      <td className="p-3 font-mono font-bold text-blue-600">{ax.weightLbs.toLocaleString()} lbs</td>
                      <td className="p-3 font-mono">{ax.positionInFeet.toFixed(1)} ft</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <AdSlot placement="InLineResults" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Commercial Vehicle Presets</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          One-click setup presets for common Class 3 through Class 8 commercial configurations. Stop starting from scratch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VEHICLE_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-6 shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  {preset.category}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  {preset.axles.length} Axles
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">{preset.name}</h2>
              <p className="text-xs text-slate-600 mb-4 line-clamp-2">{preset.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => openPresetDetail(preset.slug)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                View Specifications
              </button>
              <button
                onClick={() => handleLoadAndCalculate(preset.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow transition-colors flex items-center space-x-1"
              >
                <span>Calculate Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdSlot placement="InLineResults" />
    </div>
  );
};
