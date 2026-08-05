import React, { useEffect } from 'react';
import { ArrowLeft, Calculator, Table, ShieldCheck, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import { useTruckStore } from '../../store/useTruckStore';
import { calculateBridgeFormula } from '../../lib/pseo/bridgeFormulaCalculator';
import { injectPseoMetadata } from '../../lib/pseo/schemaGenerator';
import { VEHICLE_PRESETS } from '../../lib/data/presets';

interface Props {
  axlesCount?: number;
  spacingFeet?: number;
}

export function BridgeTableView({ axlesCount = 5, spacingFeet = 51 }: Props) {
  const { setActiveView, selectPreset } = useTruckStore();

  const calc = calculateBridgeFormula(axlesCount, spacingFeet);

  useEffect(() => {
    injectPseoMetadata({
      title: `Max Weight Limit for ${calc.axles} Axles with ${calc.spacingFeet} Feet Spacing`,
      description: `Federal Bridge Formula B calculation table for a ${calc.axles}-axle truck configuration with ${calc.spacingFeet} ft outer bridge length. Max allowed weight: ${calc.roundedBridgeWeightLbs.toLocaleString()} lbs.`,
      breadcrumbs: [
        { name: 'Home', item: '/' },
        { name: 'Bridge Formula Tables', item: '/bridge-table' },
        { name: `${calc.axles} Axles ${calc.spacingFeet} ft`, item: `/bridge-table/${calc.axles}-axles-${calc.spacingFeet}-ft` },
      ],
      datasetName: `Federal Bridge Formula Table (${calc.axles} Axles, ${calc.spacingFeet} ft Spacing)`,
      datasetDescription: `Exact mathematical weight limits derived from Federal Bridge Formula B (23 U.S.C. § 127) for ${calc.axles} axles across ${calc.spacingFeet} feet wheelbase distance.`,
      faqs: [
        {
          question: `What is the maximum legal weight for ${calc.axles} axles with ${calc.spacingFeet} feet of spacing?`,
          answer: `Under Federal Bridge Formula B, ${calc.axles} axles with an outer distance of ${calc.spacingFeet} feet can legally carry a maximum of ${calc.roundedBridgeWeightLbs.toLocaleString()} lbs without a special permit.`,
        },
        {
          question: `How is the bridge formula calculated for ${calc.axles} axles and ${calc.spacingFeet} feet?`,
          answer: `The formula is W = 500 × [ (L × N)/(N - 1) + 12N + 36 ], where L = ${calc.spacingFeet} and N = ${calc.axles}. The raw result is ${calc.rawFormulaWeight.toLocaleString()} lbs, which rounds down to ${calc.roundedBridgeWeightLbs.toLocaleString()} lbs.`,
        },
      ],
    });
  }, [axlesCount, spacingFeet, calc]);

  const handleLoadMatchingPreset = () => {
    const matchingPreset = VEHICLE_PRESETS.find((p) => p.axles.length === calc.axles) || VEHICLE_PRESETS[0];
    selectPreset(matchingPreset.id);
    setActiveView('calculator');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-[#0a1317]">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('pseo-matrix')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#0064e0] hover:text-[#0457cb] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Permutation Matrix</span>
        </button>
        <span className="text-xs font-mono text-slate-500">
          Route: /bridge-table/{calc.axles}-axles-{calc.spacingFeet}-ft
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-white border border-[#dee3e9] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#dee3e9] pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#0064e0]/10 text-[#0064e0] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight mb-3">
              <Table className="w-3.5 h-3.5" />
              <span>Bridge Formula Lookup Data</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a1317]">
              Max Legal Weight: {calc.axles} Axles with {calc.spacingFeet} Feet Spacing
            </h1>
            <p className="text-slate-600 text-sm mt-2 max-w-2xl">
              Official statutory computation under Federal Bridge Formula B (23 U.S.C. § 127) for a {calc.axles}-axle truck group spanning {calc.spacingFeet} feet from first to last axle.
            </p>
          </div>

          <div className="bg-[#f1f4f7] border border-[#dee3e9] p-5 rounded-2xl text-center shrink-0 min-w-[200px]">
            <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-tight">Bridge Limit (W)</span>
            <span className="text-3xl font-mono font-bold text-[#0064e0] block my-1">
              {calc.roundedBridgeWeightLbs.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-500">lbs</span>
            </span>
            <span className="text-[10px] font-bold text-[#31a24c] bg-[#31a24c]/10 border border-[#31a24c]/30 px-2.5 py-0.5 rounded-full inline-block">
              {calc.capReason}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            Raw unrounded mathematical formula output: <span className="font-mono font-bold text-[#0a1317]">{calc.rawFormulaWeight.toLocaleString()} lbs</span> (rounded down to 500 lb increments).
          </p>
          <button
            onClick={handleLoadMatchingPreset}
            className="bg-[#0064e0] hover:bg-[#0457cb] text-white font-bold text-xs px-6 py-3 rounded-full shadow-sm transition-all flex items-center justify-center space-x-2 w-full sm:w-auto shrink-0 tracking-tight"
          >
            <Calculator className="w-4 h-4" />
            <span>Pre-load into Interactive Live Visualizer</span>
          </button>
        </div>
      </div>

      {/* SVG Spacing Schematic Diagram */}
      <div className="bg-[#0a1317] text-white p-6 rounded-3xl border border-[#0a1317] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#0091ff]" />
          <span>Axle Spacing Diagram ({calc.axles} Axles across {calc.spacingFeet} ft)</span>
        </h3>

        {/* Render SVG Axle Schematic */}
        <div className="w-full bg-[#111c22] rounded-2xl p-4 overflow-x-auto flex flex-col items-center justify-center min-h-[140px]">
          <svg className="w-full max-w-2xl" viewBox="0 0 600 120" fill="none">
            {/* Chassis Line */}
            <line x1="40" y1="50" x2="560" y2="50" stroke="#0091ff" strokeWidth="4" strokeDasharray="6 6" />
            <rect x="35" y="40" width="530" height="8" fill="#334155" rx="4" />

            {/* Render Axle Wheels */}
            {Array.from({ length: calc.axles }).map((_, idx) => {
              const xPos = 60 + idx * (480 / (calc.axles - 1 || 1));
              return (
                <g key={idx}>
                  <circle cx={xPos} cy={75} r="14" fill="#0064e0" stroke="#ffffff" strokeWidth="3" />
                  <circle cx={xPos} cy={75} r="5" fill="#ffffff" />
                  <text x={xPos} y={105} fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Axle #{idx + 1}
                  </text>
                </g>
              );
            })}

            {/* Dimension Marker */}
            <line x1="60" y1="20" x2="540" y2="20" stroke="#0091ff" strokeWidth="2" />
            <polygon points="60,20 68,16 68,24" fill="#0091ff" />
            <polygon points="540,20 532,16 532,24" fill="#0091ff" />
            <text x="300" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
              Outer Wheelbase Distance (L) = {calc.spacingFeet} Feet
            </text>
          </svg>
        </div>
      </div>

      {/* Subgroup Evaluation Table */}
      <div className="bg-white border border-[#dee3e9] rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#0a1317] tracking-tight flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-[#0064e0]" />
          <span>Subgroup Combination Bridge Limits (N = {calc.axles})</span>
        </h2>
        <p className="text-xs text-slate-600">
          Federal Bridge Formula B requires that EVERY consecutive subgroup of axles within the vehicle configuration independently complies with the formula.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-[#dee3e9]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f1f4f7] text-[#0a1317] font-bold uppercase tracking-tight border-b border-[#dee3e9]">
              <tr>
                <th className="p-3">Axle Subgroup Range</th>
                <th className="p-3">Axle Count (N)</th>
                <th className="p-3">Outer Distance (L)</th>
                <th className="p-3">Max Allowed Bridge Weight (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee3e9]">
              {calc.subgroupsTable.map((sg, idx) => (
                <tr key={idx} className="hover:bg-[#f1f4f7]/50 transition-colors">
                  <td className="p-3 font-bold text-[#0064e0]">{sg.combination}</td>
                  <td className="p-3 font-mono text-slate-700">{sg.axleCount} axles</td>
                  <td className="p-3 font-mono text-slate-700">{sg.distanceFeet} ft</td>
                  <td className="p-3 font-mono font-bold text-[#0a1317]">{sg.allowedWeightLbs.toLocaleString()} lbs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* State Exceptions Matrix Table */}
      <div className="bg-white border border-[#dee3e9] rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#0a1317] tracking-tight">
          State-by-State Variance for {calc.axles} Axles / {calc.spacingFeet} ft
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-[#dee3e9]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f1f4f7] text-[#0a1317] font-bold uppercase tracking-tight border-b border-[#dee3e9]">
              <tr>
                <th className="p-3">State / Jurisdiction</th>
                <th className="p-3">Allowed Max Weight</th>
                <th className="p-3">Variance vs Federal</th>
                <th className="p-3">State Regulatory Exception Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee3e9]">
              {calc.stateComparisons.map((sc, idx) => (
                <tr key={idx} className="hover:bg-[#f1f4f7]/50 transition-colors">
                  <td className="p-3 font-bold text-[#0a1317]">
                    {sc.stateName} ({sc.stateAbbr})
                  </td>
                  <td className="p-3 font-mono font-bold text-[#0064e0]">{sc.allowedMaxLbs.toLocaleString()} lbs</td>
                  <td className={`p-3 font-mono font-bold ${sc.differenceFromFederalLbs > 0 ? 'text-[#31a24c]' : 'text-slate-600'}`}>
                    {sc.differenceFromFederalLbs > 0 ? `+${sc.differenceFromFederalLbs.toLocaleString()} lbs` : 'Standard'}
                  </td>
                  <td className="p-3 text-slate-600 text-[11px] font-medium">{sc.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
