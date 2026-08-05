import React, { useState } from 'react';
import { useTruckStore } from '../../store/useTruckStore';
import { Plus, Minus, MoveHorizontal, AlertTriangle, CheckCircle2, ShieldX } from 'lucide-react';

export const Visualizer: React.FC = () => {
  const {
    axles,
    getSelectedPreset,
    getComplianceResult,
    stepAxleWeight,
    updateAxlePosition,
    removeAxle,
  } = useTruckStore();

  const [selectedAxleId, setSelectedAxleId] = useState<string | null>(null);

  const preset = getSelectedPreset();
  const compliance = getComplianceResult();

  // Sort axles by position for rendering
  const sortedAxles = [...axles].sort((a, b) => a.positionInFeet - b.positionInFeet);
  const totalOuterDistance = sortedAxles.length > 0 ? sortedAxles[sortedAxles.length - 1].positionInFeet : 50;

  // Map axle position (feet) to SVG X coordinate (range: 60 to 740 px)
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingLeft = 70;
  const paddingRight = 70;
  const usableWidth = svgWidth - paddingLeft - paddingRight;

  const getXPos = (posFeet: number) => {
    const ratio = totalOuterDistance > 0 ? posFeet / totalOuterDistance : 0;
    return paddingLeft + ratio * usableWidth;
  };

  // Status color helper
  const getAxleColor = (weightLbs: number, isSteer?: boolean) => {
    const limit = isSteer ? 12000 : 17000;
    if (weightLbs > limit) return { stroke: '#ef4444', fill: '#ef4444', textClass: 'text-red-600', badgeClass: 'bg-red-100 text-red-700 border-red-200' };
    if (weightLbs >= limit - 1000) return { stroke: '#f59e0b', fill: '#f59e0b', textClass: 'text-amber-600', badgeClass: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { stroke: '#2563eb', fill: '#334155', textClass: 'text-slate-900', badgeClass: 'bg-green-100 text-green-700 border-green-200' };
  };

  return (
    <div className="bg-white rounded-3xl border border-[#dee3e9] p-5 sm:p-6 mb-6 shadow-sm relative">
      
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-[#dee3e9] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0a1317] tracking-tight">Live Vehicle Schematic</h2>
            <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#f1f4f7] text-[#0a1317] border border-[#ced0d4]">
              {axles.length} Axles
            </span>
          </div>
          <p className="text-xs text-slate-500 tracking-tight">
            Interactive visual rendering of axle positions and total outer wheelbase.
          </p>
        </div>

        {/* Overall Status Badge */}
        <div className="flex items-center space-x-2">
          {compliance.overallStatus === 'COMPLIANT' && (
            <span className="bg-[#31a24c] text-white px-3.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>COMPLIANT</span>
            </span>
          )}
          {compliance.overallStatus === 'WARNING' && (
            <span className="bg-[#f7b928] text-[#0a1317] px-3.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
              <AlertTriangle className="w-4 h-4" />
              <span>NEAR LIMIT</span>
            </span>
          )}
          {compliance.overallStatus === 'OVERWEIGHT' && (
            <span className="bg-[#e41e3f] text-white px-3.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
              <ShieldX className="w-4 h-4" />
              <span>VIOLATION DETECTED</span>
            </span>
          )}
        </div>
      </div>

      {/* SVG Truck Chassis Container */}
      <div className="relative w-full bg-[#f1f4f7] rounded-2xl border border-[#dee3e9] p-2 sm:p-4">
        {/* Mobile Swipe Hint */}
        <div className="sm:hidden text-[10px] text-slate-500 font-semibold text-center mb-1.5 flex items-center justify-center space-x-1">
          <MoveHorizontal className="w-3 h-3 text-blue-600 animate-pulse" />
          <span>Swipe left/right to view full chassis</span>
        </div>

        <div className="overflow-x-auto pb-1 scrollbar-thin">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[620px] select-none"
          >
            {/* Ground Line */}
            <line x1="20" y1="160" x2="780" y2="160" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />

            {/* Truck Chassis Main Rail */}
            <rect
              x={paddingLeft - 30}
              y="95"
              width={usableWidth + 60}
              height="10"
              rx="2"
              fill="#94a3b8"
              stroke="#64748b"
              strokeWidth="1"
            />

            {/* Cab Silhouette */}
            <path
              d={`M ${paddingLeft - 40} 105 L ${paddingLeft - 40} 60 L ${paddingLeft - 10} 35 L ${paddingLeft + 40} 35 L ${paddingLeft + 55} 105 Z`}
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            {/* Windshield */}
            <path
              d={`M ${paddingLeft - 5} 42 L ${paddingLeft + 20} 42 L ${paddingLeft + 30} 65 L ${paddingLeft - 5} 65 Z`}
              fill="#0284c7"
              opacity="0.25"
            />

            {/* Trailer Body Outline */}
            <rect
              x={paddingLeft + 65}
              y="25"
              width={usableWidth - 40}
              height="70"
              rx="2"
              fill="#f8fafc"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="4"
            />

            {/* Outer Wheelbase Overall Dimension Arrow */}
            <g>
              <line
                x1={paddingLeft}
                y1="185"
                x2={paddingLeft + usableWidth}
                y2="185"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <line x1={paddingLeft} y1="180" x2={paddingLeft} y2="190" stroke="#64748b" strokeWidth="1.5" />
              <line x1={paddingLeft + usableWidth} y1="180" x2={paddingLeft + usableWidth} y2="190" stroke="#64748b" strokeWidth="1.5" />
              <text
                x={paddingLeft + usableWidth / 2}
                y="202"
                fill="#64748b"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {totalOuterDistance.toFixed(1)}&apos; WHEELBASE (1 TO {sortedAxles.length})
              </text>
            </g>

            {/* Render Axles & Wheels */}
            {sortedAxles.map((axle, index) => {
              const x = getXPos(axle.positionInFeet);
              const isSelected = selectedAxleId === axle.id;
              const isOverweight = axle.weightLbs > (axle.isSteer ? 12000 : 17000);

              // Distance to next axle
              const nextAxle = sortedAxles[index + 1];
              const nextX = nextAxle ? getXPos(nextAxle.positionInFeet) : 0;
              const stepFeet = nextAxle ? Math.round((nextAxle.positionInFeet - axle.positionInFeet) * 10) / 10 : 0;

              return (
                <g key={axle.id} className="cursor-pointer" onClick={() => setSelectedAxleId(axle.id)}>
                  
                  {/* Vertical Axle Pin Line */}
                  <line
                    x1={x}
                    y1="100"
                    x2={x}
                    y2="145"
                    stroke={isSelected ? '#2563eb' : isOverweight ? '#ef4444' : '#64748b'}
                    strokeWidth={isSelected ? '3' : '2'}
                    strokeDasharray={axle.isLiftAxle ? '3 2' : undefined}
                  />

                  {/* Tire Wheel Circle */}
                  <circle
                    cx={x}
                    cy="145"
                    r="16"
                    fill={isOverweight ? '#ef4444' : isSelected ? '#2563eb' : '#334155'}
                    stroke="#1e293b"
                    strokeWidth="2"
                  />
                  <circle cx={x} cy="145" r="5" fill="#f8fafc" />

                  {/* Axle Number Marker */}
                  <text x={x} y="148" fill="#1e293b" fontSize="8" fontWeight="bold" textAnchor="middle">
                    {index + 1}
                  </text>

                  {/* Inter-axle Spacing Dimension */}
                  {nextAxle && stepFeet > 0 && (
                    <g>
                      <line x1={x} y1="168" x2={nextX} y2="168" stroke="#94a3b8" strokeWidth="1" />
                      <text
                        x={x + (nextX - x) / 2}
                        y="166"
                        fill="#64748b"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {stepFeet.toFixed(1)}&apos;
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Axle Summary Weights below canvas */}
        <div className="flex w-full justify-between mt-3 px-2 sm:px-10 font-mono text-[11px] text-slate-500 uppercase overflow-x-auto">
          {sortedAxles.map((ax, idx) => {
            const isOverweight = ax.weightLbs > (ax.isSteer ? 12000 : 17000);
            return (
              <div key={ax.id} className="text-center cursor-pointer min-w-[50px]" onClick={() => setSelectedAxleId(ax.id)}>
                <span className={`block font-bold ${isOverweight ? 'text-red-600' : 'text-slate-900'}`}>
                  {ax.weightLbs.toLocaleString()}
                </span>
                <span className="text-[10px]"># {idx + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Axle Math / Quick Adjust Bar */}
      <div className="mt-4 bg-slate-900 text-white p-3.5 sm:p-4 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold shrink-0">Selected:</span>
          <select
            value={selectedAxleId || sortedAxles[0]?.id || ''}
            onChange={(e) => setSelectedAxleId(e.target.value)}
            className="w-full sm:w-auto bg-slate-800 text-blue-400 font-bold border border-slate-700 rounded-md px-3 py-2 sm:py-1 focus:outline-none text-xs"
          >
            {sortedAxles.map((ax, idx) => (
              <option key={ax.id} value={ax.id}>
                Axle #{idx + 1} - {ax.name} ({ax.weightLbs.toLocaleString()} lbs)
              </option>
            ))}
          </select>
        </div>

        {/* Quick +/- 500 lbs Stepper Buttons */}
        {selectedAxleId && (
          <div className="flex items-center justify-between sm:justify-end space-x-2">
            <div className="flex items-center space-x-2 flex-1 sm:flex-initial">
              <button
                onClick={() => stepAxleWeight(selectedAxleId, -500)}
                className="flex-1 sm:flex-initial px-3 py-2 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-md font-bold border border-slate-700 flex items-center justify-center space-x-1 transition-colors touch-manipulation min-h-[40px]"
              >
                <Minus className="w-4 h-4" />
                <span>500 lbs</span>
              </button>
              <button
                onClick={() => stepAxleWeight(selectedAxleId, 500)}
                className="flex-1 sm:flex-initial px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold transition-colors flex items-center justify-center space-x-1 touch-manipulation min-h-[40px]"
              >
                <Plus className="w-4 h-4" />
                <span>500 lbs</span>
              </button>
            </div>

            {axles.length > 2 && (
              <button
                onClick={() => {
                  removeAxle(selectedAxleId);
                  setSelectedAxleId(null);
                }}
                className="text-red-400 hover:text-red-300 font-semibold text-xs px-2 py-2"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
