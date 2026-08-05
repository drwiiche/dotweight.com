import React from 'react';
import { useTruckStore } from '../../store/useTruckStore';
import { X, Printer, ShieldAlert, CheckCircle2, AlertTriangle, ShieldX } from 'lucide-react';

export const PrintSummaryModal: React.FC = () => {
  const {
    isPrintModalOpen,
    setPrintModalOpen,
    axles,
    getComplianceResult,
    getSelectedStateReg,
    getSelectedPreset,
  } = useTruckStore();

  if (!isPrintModalOpen) return null;

  const compliance = getComplianceResult();
  const stateReg = getSelectedStateReg();
  const preset = getSelectedPreset();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-[#0a1317]/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#dee3e9] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-xl text-[#0a1317] p-5 sm:p-6 print:p-0 print:bg-white print:text-black print:border-none print:shadow-none print:max-w-none print:max-h-none">
        
        {/* Modal Header (Hidden during browser print) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#dee3e9] pb-4 mb-5 print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-[#0064e0] shrink-0" />
            <h2 className="text-base font-bold text-[#0a1317] tracking-tight">DOT Compliance Report Summary</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial bg-[#0064e0] hover:bg-[#0457cb] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-2xs transition-all flex items-center justify-center space-x-1.5 min-h-[40px] touch-manipulation tracking-tight"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={() => setPrintModalOpen(false)}
              className="text-slate-500 hover:text-[#0a1317] p-2 rounded-full bg-[#f1f4f7] hover:bg-slate-200 transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6 text-sm">
          {/* Header Branding */}
          <div className="border-b-2 border-[#dee3e9] pb-4 flex flex-col sm:flex-row justify-between items-start gap-2">
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#0a1317] print:text-black">
                AxleGuard DOT Compliance Report
              </h1>
              <p className="text-xs text-slate-500 print:text-slate-600 tracking-tight">
                Evaluation Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase bg-[#f1f4f7] text-[#0064e0] border border-[#ced0d4] print:bg-slate-200 px-3.5 py-1.5 rounded-full inline-block tracking-tight">
                Jurisdiction: {stateReg.state} ({stateReg.abbreviation})
              </span>
            </div>
          </div>

          {/* Setup Summary */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-[#f1f4f7] print:bg-slate-100 p-4 rounded-2xl border border-[#dee3e9] print:border-slate-300">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 print:text-slate-600 uppercase block tracking-tight">Vehicle Configuration</span>
              <span className="font-bold text-[#0a1317] text-xs sm:text-sm print:text-black tracking-tight">{preset ? preset.name : 'Custom Setup'}</span>
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 print:text-slate-600 uppercase block tracking-tight">Overall Status</span>
              <span className={`font-bold text-xs sm:text-sm uppercase tracking-tight ${
                compliance.overallStatus === 'COMPLIANT' ? 'text-[#31a24c] print:text-[#31a24c]' : 'text-[#e41e3f] print:text-[#e41e3f]'
              }`}>
                {compliance.overallStatus}
              </span>
            </div>
          </div>

          {/* Axle Weights Breakdown */}
          <div>
            <h3 className="font-bold text-[#0a1317] print:text-black text-xs uppercase mb-2 tracking-tight">Individual Axle & Group Weights</h3>
            <div className="overflow-x-auto rounded-2xl border border-[#dee3e9] print:border-slate-300">
              <table className="w-full min-w-[440px] text-left text-xs">
                <thead className="bg-[#f1f4f7] print:bg-slate-200 text-slate-600 print:text-black border-b border-[#dee3e9] font-bold uppercase tracking-tight">
                  <tr>
                    <th className="p-2.5">Axle #</th>
                    <th className="p-2.5">Name / Group</th>
                    <th className="p-2.5">Position (ft)</th>
                    <th className="p-2.5">Weight (lbs)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee3e9] print:divide-slate-300">
                  {axles.map((ax, i) => (
                    <tr key={ax.id}>
                      <td className="p-2.5 font-bold text-[#0064e0]">Axle #{i + 1}</td>
                      <td className="p-2.5 text-[#0a1317] font-medium">{ax.name}</td>
                      <td className="p-2.5 font-mono text-slate-700">{ax.positionInFeet.toFixed(1)} ft</td>
                      <td className="p-2.5 font-mono font-bold text-[#0a1317]">{ax.weightLbs.toLocaleString()} lbs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subgroup Bridge Evaluation Table */}
          <div>
            <h3 className="font-bold text-[#0a1317] print:text-black text-xs uppercase mb-2 tracking-tight">Subgroup Bridge Formula Results</h3>
            <div className="overflow-x-auto rounded-2xl border border-[#dee3e9] print:border-slate-300">
              <table className="w-full min-w-[500px] text-left text-xs">
                <thead className="bg-[#f1f4f7] print:bg-slate-200 text-slate-600 print:text-black border-b border-[#dee3e9] font-bold uppercase tracking-tight">
                  <tr>
                    <th className="p-2.5">Subgroup Range</th>
                    <th className="p-2.5">Outer Distance (L)</th>
                    <th className="p-2.5">Actual Weight</th>
                    <th className="p-2.5">Max Bridge Limit</th>
                    <th className="p-2.5">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee3e9] print:divide-slate-300">
                  {compliance.subgroups.map((sg, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold text-[#0a1317]">{sg.axleRangeText}</td>
                      <td className="p-2.5 font-mono text-slate-700">{sg.outerDistanceFeet} ft</td>
                      <td className="p-2.5 font-mono text-slate-700">{sg.actualWeightLbs.toLocaleString()} lbs</td>
                      <td className="p-2.5 font-mono text-slate-700">{sg.maxAllowedBridgeLbs.toLocaleString()} lbs</td>
                      <td className={`p-2.5 font-bold ${sg.isCompliant ? 'text-[#31a24c] print:text-[#31a24c]' : 'text-[#e41e3f] print:text-[#e41e3f]'}`}>
                        {sg.isCompliant ? 'PASS' : `FAIL (+${sg.excessLbs.toLocaleString()} lbs)`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-950 print:text-black print:border-slate-400 font-medium">
            <span className="font-bold">Legal Disclaimer:</span> This report is calculated strictly using Federal Bridge Formula B statutory algorithms and available state regulations. Official weigh stations and state enforcement scales maintain sole legal authority over fines and permits.
          </div>
        </div>
      </div>
    </div>
  );
};
