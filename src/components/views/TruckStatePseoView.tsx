import React, { useEffect } from 'react';
import { ArrowLeft, Calculator, ShieldCheck, Phone, ExternalLink, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useTruckStore } from '../../store/useTruckStore';
import { VEHICLE_PRESETS } from '../../lib/data/presets';
import { STATE_REGULATIONS } from '../../lib/data/states';
import { getStateStatuteInfo } from '../../lib/data/statutes';
import { evaluateTruckCompliance } from '../../lib/math/evaluateTruck';
import { injectPseoMetadata } from '../../lib/pseo/schemaGenerator';

interface Props {
  vehicleSlug?: string;
  stateSlug?: string;
}

export function TruckStatePseoView({ vehicleSlug = '4-axle-dump-truck-pusher', stateSlug = 'ohio' }: Props) {
  const { selectPreset, selectState, setActiveView } = useTruckStore();

  const vehicle = VEHICLE_PRESETS.find((v) => v.slug === vehicleSlug) || VEHICLE_PRESETS[1];
  const stateReg = STATE_REGULATIONS.find((s) => s.slug === stateSlug) || STATE_REGULATIONS.find((s) => s.slug === 'ohio') || STATE_REGULATIONS[0];
  const statuteInfo = getStateStatuteInfo(stateReg.slug);

  // Evaluate precalculated compliance
  const evaluation = evaluateTruckCompliance(vehicle.axles, vehicle.recommendedGVW, stateReg);

  useEffect(() => {
    injectPseoMetadata({
      title: `${vehicle.name} Max Weight Limits in ${stateReg.state}`,
      description: `DOT weight regulations and Bridge Formula limits for a ${vehicle.name} in ${stateReg.state}. Statute: ${statuteInfo.statuteCitation}. Max legal GVW: ${stateReg.maxGVWStandardLbs.toLocaleString()} lbs.`,
      breadcrumbs: [
        { name: 'Home', item: '/' },
        { name: 'Truck Configurations', item: '/trucks' },
        { name: vehicle.name, item: `/trucks/${vehicle.slug}` },
        { name: `${stateReg.state} Limits`, item: `/trucks/${vehicle.slug}/${stateReg.slug}` },
      ],
      datasetName: `${vehicle.name} - ${stateReg.state} DOT Weight Compliance Data`,
      datasetDescription: `Official DOT weight limit evaluation for ${vehicle.name} operating under ${stateReg.state} highway regulations (${statuteInfo.statuteCitation}).`,
      faqs: [
        {
          question: `What is the maximum legal gross weight for a ${vehicle.name} in ${stateReg.state}?`,
          answer: `The maximum legal non-permit gross vehicle weight (GVW) for a ${vehicle.name} in ${stateReg.state} is ${stateReg.maxGVWStandardLbs.toLocaleString()} lbs, subject to single and tandem axle group limits.`,
        },
        {
          question: `What are the pusher axle regulations for ${vehicle.name} in ${stateReg.state}?`,
          answer: `${statuteInfo.pusherAxleRegulation}`,
        },
        {
          question: `What state law governs truck weight limits in ${stateReg.state}?`,
          answer: `${stateReg.state} truck weight limits are dictated by ${statuteInfo.statuteCitation}. Permits are required when gross weight exceeds ${statuteInfo.permitTriggerThreshold}.`,
        },
      ],
    });
  }, [vehicleSlug, stateSlug, vehicle, stateReg, statuteInfo]);

  const handleLaunchInLiveCalculator = () => {
    selectPreset(vehicle.id);
    selectState(stateReg.slug);
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
          Route: /trucks/{vehicle.slug}/{stateReg.slug}
        </span>
      </div>

      {/* Hero Card */}
      <div className="bg-white border border-[#dee3e9] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#dee3e9] pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#0064e0]/10 text-[#0064e0] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Programmatic SEO Data Payload</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a1317]">
              {vehicle.name} Weight Limit in {stateReg.state}
            </h1>
            <p className="text-slate-600 text-sm mt-2 max-w-2xl">
              Official statutory specs, lift axle regulations, and bridge formula calculations under <span className="font-bold text-[#0a1317]">{statuteInfo.statuteCitation}</span>.
            </p>
          </div>

          <div className="bg-[#f1f4f7] border border-[#dee3e9] p-5 rounded-2xl text-center shrink-0 min-w-[210px]">
            <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-tight">Overall Status</span>
            <span
              className={`text-lg font-mono font-bold block my-1 ${
                evaluation.overallStatus === 'COMPLIANT' ? 'text-[#31a24c]' : 'text-[#e41e3f]'
              }`}
            >
              {evaluation.overallStatus === 'COMPLIANT' ? '100% COMPLIANT' : 'OVERWEIGHT WARNING'}
            </span>
            <span className="text-[10px] font-bold text-slate-600 bg-white border border-[#dee3e9] px-2.5 py-0.5 rounded-full inline-block">
              {evaluation.totalGVWLbs.toLocaleString()} / {stateReg.maxGVWStandardLbs.toLocaleString()} lbs
            </span>
          </div>
        </div>

        {/* 4 Unique Data Payload Cards (Anti-Thin-Content Engine) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tight">Statute Citation</span>
            <span className="font-bold text-[#0a1317] block text-sm tracking-tight">{statuteInfo.statuteCitation}</span>
            <p className="text-[11px] text-slate-500">Official statutory code governing road weight limits.</p>
          </div>

          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tight">Pusher / Lift Axle Rule</span>
            <span className="font-bold text-[#0a1317] block text-xs line-clamp-2">{statuteInfo.pusherAxleRegulation}</span>
          </div>

          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tight">Permit Trigger Threshold</span>
            <span className="font-bold text-[#0a1317] block text-xs">{statuteInfo.permitTriggerThreshold}</span>
          </div>

          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tight">Local DOT Contact</span>
            <a href={`tel:${statuteInfo.dotPhone}`} className="font-bold text-[#0064e0] hover:underline flex items-center space-x-1 text-sm">
              <Phone className="w-3.5 h-3.5" />
              <span>{statuteInfo.dotPhone}</span>
            </a>
            <a
              href={statuteInfo.permitWebsite}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#0064e0] hover:underline flex items-center space-x-1 font-bold mt-1"
            >
              <span>Permit Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleLaunchInLiveCalculator}
            className="bg-[#0064e0] hover:bg-[#0457cb] text-white font-bold text-xs px-6 py-3 rounded-full shadow-sm transition-all flex items-center justify-center space-x-2 w-full sm:w-auto tracking-tight"
          >
            <Calculator className="w-4 h-4" />
            <span>Open {vehicle.name} in Live Interactive Visualizer ({stateReg.state})</span>
          </button>
        </div>
      </div>

      {/* Precalculated Axle Breakdown Table */}
      <div className="bg-white border border-[#dee3e9] rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#0a1317] tracking-tight flex items-center space-x-2">
          <FileText className="w-5 h-5 text-[#0064e0]" />
          <span>Precalculated Axle Load Breakdown for {vehicle.name}</span>
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-[#dee3e9]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f1f4f7] text-[#0a1317] font-bold uppercase tracking-tight border-b border-[#dee3e9]">
              <tr>
                <th className="p-3">Axle #</th>
                <th className="p-3">Axle Name & Category</th>
                <th className="p-3">Position (ft)</th>
                <th className="p-3">Baseline Load (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee3e9]">
              {vehicle.axles.map((ax, idx) => (
                <tr key={ax.id} className="hover:bg-[#f1f4f7]/50 transition-colors">
                  <td className="p-3 font-bold text-[#0064e0]">Axle #{idx + 1}</td>
                  <td className="p-3 font-bold text-[#0a1317]">
                    {ax.name} {ax.isLiftAxle && <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full ml-1 font-bold">Pusher</span>}
                  </td>
                  <td className="p-3 font-mono text-slate-700">{ax.positionInFeet.toFixed(1)} ft</td>
                  <td className="p-3 font-mono font-bold text-[#0a1317]">{ax.weightLbs.toLocaleString()} lbs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Precalculated Subgroup Compliance Table */}
      <div className="bg-white border border-[#dee3e9] rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#0a1317] tracking-tight">
          Bridge Formula Subgroup Compliance in {stateReg.state}
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-[#dee3e9]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f1f4f7] text-[#0a1317] font-bold uppercase tracking-tight border-b border-[#dee3e9]">
              <tr>
                <th className="p-3">Subgroup Range</th>
                <th className="p-3">Outer Distance (L)</th>
                <th className="p-3">Actual Weight</th>
                <th className="p-3">Allowed Bridge Limit</th>
                <th className="p-3">Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee3e9]">
              {evaluation.subgroups.map((sg, idx) => (
                <tr key={idx} className="hover:bg-[#f1f4f7]/50 transition-colors">
                  <td className="p-3 font-bold text-[#0a1317]">{sg.axleRangeText}</td>
                  <td className="p-3 font-mono text-slate-700">{sg.outerDistanceFeet} ft</td>
                  <td className="p-3 font-mono font-bold text-[#0a1317]">{sg.actualWeightLbs.toLocaleString()} lbs</td>
                  <td className="p-3 font-mono font-bold text-slate-600">{sg.maxAllowedBridgeLbs.toLocaleString()} lbs</td>
                  <td className="p-3 font-bold">
                    {sg.isCompliant ? (
                      <span className="text-[#31a24c] inline-flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>PASS</span>
                      </span>
                    ) : (
                      <span className="text-[#e41e3f] inline-flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>FAIL (+{sg.excessLbs.toLocaleString()} lbs)</span>
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
}
