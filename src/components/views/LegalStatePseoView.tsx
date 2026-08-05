import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Phone, ExternalLink, Scale, FileText, ArrowRight, Building2 } from 'lucide-react';
import { useTruckStore } from '../../store/useTruckStore';
import { STATE_REGULATIONS } from '../../lib/data/states';
import { getStateStatuteInfo } from '../../lib/data/statutes';
import { VEHICLE_PRESETS } from '../../lib/data/presets';
import { injectPseoMetadata } from '../../lib/pseo/schemaGenerator';

interface Props {
  stateSlug?: string;
}

export function LegalStatePseoView({ stateSlug = 'texas' }: Props) {
  const { selectState, openTruckStatePermutation, setActiveView } = useTruckStore();

  const stateReg = STATE_REGULATIONS.find((s) => s.slug === stateSlug) || STATE_REGULATIONS[0];
  const statuteInfo = getStateStatuteInfo(stateReg.slug);

  useEffect(() => {
    injectPseoMetadata({
      title: `${stateReg.state} Commercial Vehicle DOT Weight Laws & Permits`,
      description: `Complete guide to ${stateReg.state} commercial truck weight limits, axle loads, Bridge Formula B compliance, and oversize permit thresholds under ${statuteInfo.statuteCitation}.`,
      breadcrumbs: [
        { name: 'Home', item: '/' },
        { name: 'State Laws', item: '/legal' },
        { name: `${stateReg.state} DOT Weight Laws`, item: `/legal/${stateReg.slug}-dot-weight-laws` },
      ],
      faqs: [
        {
          question: `What is the legal single and tandem axle limit in ${stateReg.state}?`,
          answer: `In ${stateReg.state}, single axles are limited to ${stateReg.singleAxleLimitLbs.toLocaleString()} lbs and tandem axles are limited to ${stateReg.tandemAxleLimitLbs.toLocaleString()} lbs without special permits.`,
        },
        {
          question: `What is the permit website and contact number for ${stateReg.state} DOT?`,
          answer: `The ${stateReg.state} DOT permit department can be contacted by phone at ${statuteInfo.dotPhone} or online at ${statuteInfo.permitWebsite}.`,
        },
      ],
    });
  }, [stateSlug, stateReg, statuteInfo]);

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
          Route: /legal/{stateReg.slug}-dot-weight-laws
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-white border border-[#dee3e9] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#dee3e9] pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#0064e0]/10 text-[#0064e0] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>State Statutory Legal Code</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a1317]">
              {stateReg.state} DOT Weight Laws & Regulations
            </h1>
            <p className="text-slate-600 text-sm mt-2 max-w-2xl">
              Official statutory limits, axle load maximums, and permit rules under <span className="font-bold text-[#0a1317]">{statuteInfo.statuteCitation}</span>.
            </p>
          </div>

          <div className="bg-[#f1f4f7] border border-[#dee3e9] p-5 rounded-2xl text-center shrink-0 min-w-[210px]">
            <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-tight">Max Standard GVW</span>
            <span className="text-3xl font-mono font-bold text-[#0064e0] block my-1">
              {stateReg.maxGVWStandardLbs.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-500">lbs</span>
            </span>
            <span className="text-[10px] font-bold text-slate-600 bg-white border border-[#dee3e9] px-2.5 py-0.5 rounded-full inline-block">
              Jurisdiction Code: {stateReg.abbreviation}
            </span>
          </div>
        </div>

        {/* Axle Limits Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tight">Steer Axle Limit</span>
            <span className="font-mono text-base font-bold text-[#0a1317] block my-1">{stateReg.steerAxleLimitLbs.toLocaleString()} lbs</span>
            <span className="text-[11px] text-slate-500">Subject to tire width ratings.</span>
          </div>

          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tight">Single Axle Limit</span>
            <span className="font-mono text-base font-bold text-[#0a1317] block my-1">{stateReg.singleAxleLimitLbs.toLocaleString()} lbs</span>
            <span className="text-[11px] text-slate-500">Spacing &gt; 8 feet.</span>
          </div>

          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tight">Tandem Axle Limit</span>
            <span className="font-mono text-base font-bold text-[#0a1317] block my-1">{stateReg.tandemAxleLimitLbs.toLocaleString()} lbs</span>
            <span className="text-[11px] text-slate-500">Spacing 4 ft to 8 ft.</span>
          </div>

          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tight">Tridem Axle Limit</span>
            <span className="font-mono text-base font-bold text-[#0a1317] block my-1">{stateReg.tridemAxleLimitLbs.toLocaleString()} lbs</span>
            <span className="text-[11px] text-slate-500">3-axle group max.</span>
          </div>
        </div>

        {/* Special Rules & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 bg-white border border-[#dee3e9] rounded-2xl space-y-2">
            <h3 className="font-bold text-[#0a1317] text-sm flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#0064e0]" />
              <span>Statutory Key Rule Summary</span>
            </h3>
            <p className="text-slate-700 font-medium leading-relaxed">{stateReg.keyRuleSummary}</p>
            <div className="pt-2">
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Pusher / Lift Axle Regulation</span>
              <p className="text-slate-600 mt-0.5">{statuteInfo.pusherAxleRegulation}</p>
            </div>
          </div>

          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl space-y-3">
            <h3 className="font-bold text-[#0a1317] text-sm flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#0064e0]" />
              <span>State DOT Oversize Permit Contacts</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">DOT Phone Number:</span>
                <a href={`tel:${statuteInfo.dotPhone}`} className="font-mono font-bold text-[#0064e0] hover:underline">
                  {statuteInfo.dotPhone}
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Permit Portal:</span>
                <a
                  href={statuteInfo.permitWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#0064e0] hover:underline inline-flex items-center space-x-1"
                >
                  <span>Official Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#dee3e9]">
                <span className="text-slate-600">Permit Threshold:</span>
                <span className="font-bold text-[#0a1317]">{statuteInfo.permitTriggerThreshold}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Permutations Grid for this State */}
      <div className="bg-white border border-[#dee3e9] rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#0a1317] tracking-tight flex items-center space-x-2">
          <Scale className="w-5 h-5 text-[#0064e0]" />
          <span>Vehicle Configurations Evaluated in {stateReg.state}</span>
        </h2>
        <p className="text-xs text-slate-600">
          Select a vehicle configuration below to see exact precalculated bridge formula specs, axle load allocations, and statutory compliance in {stateReg.state}.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {VEHICLE_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => openTruckStatePermutation(p.slug, stateReg.slug)}
              className="p-4 bg-[#f1f4f7] hover:bg-[#0064e0]/5 border border-[#dee3e9] hover:border-[#0064e0]/40 rounded-2xl text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-[#0064e0] uppercase block tracking-tight">{p.category}</span>
                <h3 className="font-bold text-[#0a1317] text-xs group-hover:text-[#0064e0] transition-colors mt-0.5">
                  {p.name}
                </h3>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#0064e0]">
                <span>View {stateReg.state} Specs</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
