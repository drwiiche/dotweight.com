import React from 'react';
import { useTruckStore } from '../../store/useTruckStore';
import { VEHICLE_PRESETS } from '../../lib/data/presets';
import { Plus, Minus, MoveHorizontal, RotateCcw, PlusCircle, Scale, SlidersHorizontal } from 'lucide-react';

export const Controls: React.FC = () => {
  const {
    axles,
    selectedPresetId,
    selectPreset,
    updateAxleWeight,
    stepAxleWeight,
    updateAxlePosition,
    addAxle,
    removeAxle,
  } = useTruckStore();

  const sortedAxles = [...axles].sort((a, b) => a.positionInFeet - b.positionInFeet);

  return (
    <div className="bg-white border border-[#dee3e9] rounded-3xl p-5 sm:p-6 shadow-sm mb-6">
      
      {/* Preset Selector Pill Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-tight text-slate-600 flex items-center space-x-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#0064e0]" />
            <span>Quick Presets</span>
          </label>
          <button
            onClick={() => selectPreset(selectedPresetId)}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center space-x-1 font-bold tracking-tight"
            title="Reset preset to default weights"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#0064e0]" />
            <span>Reset Weights</span>
          </button>
        </div>

        {/* Scrollable preset buttons on mobile */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x -mx-1 px-1">
          {VEHICLE_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-all flex items-center space-x-2 border shrink-0 ${
                  isSelected
                    ? 'bg-[#0064e0] border-[#0064e0] text-white shadow-sm'
                    : 'bg-[#f1f4f7] border-transparent text-[#1c1e21] hover:bg-slate-200'
                }`}
              >
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Axles Control Cards Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-tight">Axle Group Weight (LBS) & Wheelbase</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => addAxle('pusher')}
              className="flex-1 sm:flex-initial px-4 py-2 bg-[#f1f4f7] hover:bg-slate-200 text-[#0a1317] text-xs font-bold tracking-tight rounded-full border border-[#ced0d4] flex items-center justify-center space-x-1.5 transition-all touch-manipulation min-h-[38px]"
            >
              <PlusCircle className="w-4 h-4 text-amber-600" />
              <span>+ Lift/Pusher</span>
            </button>
            <button
              onClick={() => addAxle('trailer')}
              className="flex-1 sm:flex-initial px-4 py-2 bg-[#f1f4f7] hover:bg-slate-200 text-[#0a1317] text-xs font-bold tracking-tight rounded-full border border-[#ced0d4] flex items-center justify-center space-x-1.5 transition-all touch-manipulation min-h-[38px]"
            >
              <PlusCircle className="w-4 h-4 text-[#0064e0]" />
              <span>+ Trailer Axle</span>
            </button>
          </div>
        </div>

        {/* Individual Axle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAxles.map((axle, index) => {
            // Calculate feet and inches for position input
            const totalInches = Math.round(axle.positionInFeet * 12);
            const feet = Math.floor(totalInches / 12);
            const inches = totalInches % 12;

            // Spacing from previous axle
            const prevAxle = index > 0 ? sortedAxles[index - 1] : null;
            const stepFromPrevFeet = prevAxle ? Math.round((axle.positionInFeet - prevAxle.positionInFeet) * 10) / 10 : 0;

            return (
              <div
                key={axle.id}
                className="bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
              >
                {/* Axle Header */}
                <div className="flex items-center justify-between mb-3 border-b border-[#dee3e9] pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-[#0a1317] text-white font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#0a1317] tracking-tight">{axle.name}</h4>
                      <span className="text-[10px] text-[#0064e0] font-mono font-bold">
                        Limit: {axle.isSteer ? '20k' : '34k'} {axle.isLiftAxle ? '• Lift' : ''}
                      </span>
                    </div>
                  </div>

                  {sortedAxles.length > 2 && (
                    <button
                      onClick={() => removeAxle(axle.id)}
                      className="text-slate-400 hover:text-red-600 p-1 text-xs font-bold rounded-full"
                      title="Remove Axle"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Weight Input & +/- 500 lbs Stepper Touch Controls */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 tracking-tight">Weight (lbs)</label>
                    <span className="text-[10px] text-slate-500 font-mono">Step: +/- 500 lbs</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => stepAxleWeight(axle.id, -500)}
                      className="w-11 h-11 sm:w-12 sm:h-12 bg-white border border-[#ced0d4] text-[#0a1317] font-bold rounded-xl text-2xl flex items-center justify-center active:bg-[#0064e0] active:text-white transition-colors shrink-0 shadow-xs touch-manipulation"
                      title="Subtract 500 lbs"
                      aria-label="Subtract 500 lbs"
                    >
                      -
                    </button>

                    <div className="relative flex-1">
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        step="100"
                        value={axle.weightLbs}
                        onChange={(e) => updateAxleWeight(axle.id, Number(e.target.value))}
                        className="w-full bg-white border border-[#ced0d4] rounded-xl py-2.5 px-2 text-center font-mono font-bold text-lg sm:text-xl text-[#0a1317] focus:outline-none focus:ring-2 focus:ring-[#0064e0] shadow-xs"
                      />
                    </div>

                    <button
                      onClick={() => stepAxleWeight(axle.id, 500)}
                      className="w-11 h-11 sm:w-12 sm:h-12 bg-white border border-[#ced0d4] text-[#0a1317] font-bold rounded-xl text-2xl flex items-center justify-center active:bg-[#0064e0] active:text-white transition-colors shrink-0 shadow-xs touch-manipulation"
                      title="Add 500 lbs"
                      aria-label="Add 500 lbs"
                    >
                      +
                    </button>
                  </div>

                  {/* Weight Touch Slider */}
                  <div className="mt-2.5">
                    <input
                      type="range"
                      min="0"
                      max="30000"
                      step="500"
                      value={axle.weightLbs}
                      onChange={(e) => updateAxleWeight(axle.id, Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0064e0]"
                    />
                  </div>
                </div>

                {/* Spacing / Wheelbase Position Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-600 flex items-center space-x-1 tracking-tight">
                      <MoveHorizontal className="w-3 h-3 text-[#0064e0]" />
                      <span>Position from Axle #1</span>
                    </label>
                    {prevAxle && (
                      <span className="text-[10px] text-[#0064e0] font-mono font-bold">
                        +{stepFromPrevFeet} ft
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Feet */}
                    <div className="flex items-center bg-white border border-[#ced0d4] rounded-xl px-2 py-1.5 shadow-xs">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="100"
                        value={feet}
                        onChange={(e) => {
                          const newFt = Number(e.target.value);
                          updateAxlePosition(axle.id, newFt + inches / 12);
                        }}
                        className="w-full bg-transparent text-sm font-mono font-bold text-[#0a1317] text-center focus:outline-none"
                      />
                      <span className="text-[10px] font-bold text-slate-400">FT</span>
                    </div>

                    {/* Inches */}
                    <div className="flex items-center bg-white border border-[#ced0d4] rounded-xl px-2 py-1.5 shadow-xs">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="11"
                        value={inches}
                        onChange={(e) => {
                          const newIn = Number(e.target.value);
                          updateAxlePosition(axle.id, feet + newIn / 12);
                        }}
                        className="w-full bg-transparent text-sm font-mono font-bold text-[#0a1317] text-center focus:outline-none"
                      />
                      <span className="text-[10px] font-bold text-slate-400">IN</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
