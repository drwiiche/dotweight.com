import React, { useState } from 'react';
import { useTruckStore } from '../../store/useTruckStore';
import { CheckCircle2, AlertTriangle, ShieldX, FileText, ChevronDown, ChevronUp, Scale, Info, MapPin } from 'lucide-react';

export const ResultsCard: React.FC = () => {
  const {
    getComplianceResult,
    getSelectedStateReg,
    setPrintModalOpen,
  } = useTruckStore();

  const [showAllSubgroups, setShowAllSubgroups] = useState(false);

  const compliance = getComplianceResult();
  const stateReg = getSelectedStateReg();

  // GVW gauge percentage
  const gvwPercent = Math.min(100, Math.round((compliance.totalGVWLbs / compliance.maxGVWLbs) * 100));

  return (
    <div className="bg-white border border-[#dee3e9] rounded-3xl p-5 sm:p-6 shadow-sm mb-6">
      
      {/* Top Banner Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#dee3e9] pb-5 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-tight text-slate-500">Jurisdiction:</span>
            <span className="text-xs font-bold text-[#0064e0] flex items-center space-x-1 bg-[#f1f4f7] px-3 py-1 rounded-full border border-[#ced0d4]">
              <MapPin className="w-3.5 h-3.5 text-[#0064e0]" />
              <span>{stateReg.state} ({stateReg.abbreviation})</span>
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0a1317] tracking-tight mt-1.5">DOT Bridge Compliance Evaluation</h2>
        </div>

        {/* Big Pass / Fail Badge */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end space-x-3">
          {compliance.overallStatus === 'COMPLIANT' && (
            <div className="flex items-center space-x-2 bg-[#31a24c] text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>COMPLIANT (LEGAL)</span>
            </div>
          )}
          {compliance.overallStatus === 'WARNING' && (
            <div className="flex items-center space-x-2 bg-[#f7b928] text-[#0a1317] px-4 py-2 rounded-full text-xs font-bold shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-[#0a1317]" />
              <span>NEAR LIMIT (WARNING)</span>
            </div>
          )}
          {compliance.overallStatus === 'OVERWEIGHT' && (
            <div className="flex items-center space-x-2 bg-[#e41e3f] text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xs">
              <ShieldX className="w-4 h-4 text-white" />
              <span>OVERWEIGHT (NON-COMPLIANT)</span>
            </div>
          )}

          {/* PDF Report Trigger */}
          <button
            onClick={() => setPrintModalOpen(true)}
            className="bg-[#0064e0] hover:bg-[#0457cb] text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-2xs transition-all flex items-center space-x-1.5 shrink-0 tracking-tight"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF Summary</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Gross Vehicle Weight Progress Gauge */}
      <div className="bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl p-4.5 mb-6">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center space-x-1.5">
            <Scale className="w-4 h-4 text-[#0064e0]" />
            <span className="font-bold text-[#0a1317] tracking-tight">Gross Vehicle Weight (GVW)</span>
          </div>
          <div className="font-mono font-bold text-[#0a1317]">
            <span className={compliance.isGVWCompliant ? 'text-[#0a1317]' : 'text-[#e41e3f]'}>
              {compliance.totalGVWLbs.toLocaleString()} lbs
            </span>{' '}
            / <span className="text-slate-500">{compliance.maxGVWLbs.toLocaleString()} lbs Max</span>
          </div>
        </div>

        {/* Bar */}
        <div className="w-full h-3 bg-slate-200/90 rounded-full overflow-hidden p-0.5 border border-slate-300/80">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              compliance.isGVWCompliant
                ? gvwPercent > 95 ? 'bg-[#f7b928]' : 'bg-[#0064e0]'
                : 'bg-[#e41e3f]'
            }`}
            style={{ width: `${gvwPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mt-1.5 tracking-tight">
          <span>0 lbs</span>
          <span>{gvwPercent}% Capacity</span>
          <span>{compliance.maxGVWLbs.toLocaleString()} lbs Limit</span>
        </div>
      </div>

      {/* Violations / Warnings Callouts */}
      {compliance.violations.length > 0 && (
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-tight text-slate-600">Compliance Issues & Violations</h3>
          {compliance.violations.map((v, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-2xl border flex items-start space-x-2.5 text-xs ${
                v.severity === 'error'
                  ? 'bg-red-50 border-red-200 text-red-950 font-medium'
                  : 'bg-amber-50 border-amber-200 text-amber-950 font-medium'
              }`}
            >
              {v.severity === 'error' ? (
                <ShieldX className="w-4 h-4 text-[#e41e3f] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#f2a918] shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold">{v.title}:</span> {v.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* State-Specific Variance Notes */}
      {compliance.stateNotes.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-xs text-blue-950 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-[#0064e0]">
            <Info className="w-4 h-4 text-[#0064e0]" />
            <span>{stateReg.state} Route Specific Rules & Tolerances</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1 font-medium">
            {compliance.stateNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Subgroup Evaluation Table (N=2,3,4,5) */}
      <div className="border border-[#dee3e9] rounded-2xl overflow-hidden bg-white shadow-2xs">
        <div className="p-4 bg-[#f1f4f7] border-b border-[#dee3e9] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#0a1317] uppercase tracking-tight">
              Subgroup Bridge Formula Breakdown ({compliance.subgroups.length} Combinations)
            </h3>
            <p className="text-[11px] text-slate-500 tracking-tight">
              Evaluates every consecutive set of axles ($N=2, 3, 4, 5$) against Federal Bridge Formula B.
            </p>
          </div>

          <button
            onClick={() => setShowAllSubgroups(!showAllSubgroups)}
            className="text-xs text-[#0064e0] hover:text-[#0457cb] font-bold flex items-center space-x-1 tracking-tight"
          >
            <span>{showAllSubgroups ? 'Show Fewer' : 'View All Combinations'}</span>
            {showAllSubgroups ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile View: Cards */}
        <div className="sm:hidden divide-y divide-[#dee3e9]">
          {(showAllSubgroups ? compliance.subgroups : compliance.subgroups.slice(0, 5)).map((sg, idx) => (
            <div key={idx} className={`p-3.5 space-y-1.5 ${sg.isCompliant ? 'bg-white' : 'bg-red-50/70'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0a1317]">{sg.axleRangeText}</span>
                {sg.isCompliant ? (
                  <span className="text-white bg-[#31a24c] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Pass
                  </span>
                ) : (
                  <span className="text-white bg-[#e41e3f] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Over (+{sg.excessLbs.toLocaleString()} lbs)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Actual Weight</span>
                  <span className="font-bold text-[#0a1317]">{sg.actualWeightLbs.toLocaleString()} lbs</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Bridge Formula Limit</span>
                  <span className="font-semibold text-slate-600">{sg.maxAllowedBridgeLbs.toLocaleString()} lbs</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 font-mono">
                <span>{sg.axleCount} Axles</span>
                <span>Distance: {sg.outerDistanceFeet} ft</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0a1317]">
            <thead className="bg-[#f1f4f7] text-[10px] uppercase font-bold text-slate-600 border-b border-[#dee3e9] tracking-tight">
              <tr>
                <th className="p-3">Axle Subgroup</th>
                <th className="p-3">Axle Count (N)</th>
                <th className="p-3">Outer Distance (L)</th>
                <th className="p-3">Actual Weight</th>
                <th className="p-3">Bridge Limit</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee3e9]">
              {(showAllSubgroups ? compliance.subgroups : compliance.subgroups.slice(0, 5)).map((sg, idx) => (
                <tr key={idx} className={sg.isCompliant ? 'hover:bg-[#f1f4f7]/60' : 'bg-red-50/80 hover:bg-red-100/60'}>
                  <td className="p-3 font-bold text-[#0a1317]">{sg.axleRangeText}</td>
                  <td className="p-3 font-mono">{sg.axleCount} Axles</td>
                  <td className="p-3 font-mono">{sg.outerDistanceFeet} ft</td>
                  <td className="p-3 font-mono font-bold">{sg.actualWeightLbs.toLocaleString()} lbs</td>
                  <td className="p-3 font-mono text-slate-600">{sg.maxAllowedBridgeLbs.toLocaleString()} lbs</td>
                  <td className="p-3 font-bold">
                    {sg.isCompliant ? (
                      <span className="text-white bg-[#31a24c] px-2.5 py-0.5 rounded-full text-[10px]">
                        Pass
                      </span>
                    ) : (
                      <span className="text-white bg-[#e41e3f] px-2.5 py-0.5 rounded-full text-[10px]">
                        Over ({sg.excessLbs.toLocaleString()} lbs)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
