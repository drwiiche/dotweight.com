import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Phone, ExternalLink, Scale, FileText, ArrowRight, Building2, BookOpen, AlertCircle } from 'lucide-react';
import { useTruckStore } from '../../store/useTruckStore';
import { STATE_REGULATIONS } from '../../lib/data/states';
import { getStateStatuteInfo } from '../../lib/data/statutes';
import { VEHICLE_PRESETS } from '../../lib/data/presets';
import { injectPseoMetadata } from '../../lib/pseo/schemaGenerator';

interface Props {
  stateSlug?: string;
}

export function LegalStatePseoView({ stateSlug = 'california' }: Props) {
  const { selectState, openTruckStatePermutation, setActiveView } = useTruckStore();

  const stateReg = STATE_REGULATIONS.find((s) => s.slug === stateSlug) || STATE_REGULATIONS[0];
  const statuteInfo = getStateStatuteInfo(stateReg.slug);

  useEffect(() => {
    injectPseoMetadata({
      title: `${stateReg.state} Commercial Vehicle DOT Weight Laws & Permits`,
      description: `Complete guide to ${stateReg.state} commercial truck weight limits, axle loads, Bridge Formula B compliance, and oversize permit thresholds under ${statuteInfo.statuteCitation}.`,
      breadcrumbs: [
        { name: 'Home', item: '/' },
        { name: '50-State Regulations', item: '/legal-states' },
        { name: `${stateReg.state} DOT Weight Laws`, item: `/legal/${stateReg.slug}` },
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
        {
          question: `Does ${stateReg.state} enforce the Federal Bridge Formula B?`,
          answer: `${stateReg.state} enforces ${statuteInfo.statuteCitation}, requiring all consecutive axle combinations to comply with Bridge Formula B up to ${stateReg.maxGVWStandardLbs.toLocaleString()} lbs gross vehicle weight.`,
        },
      ],
    });
  }, [stateSlug, stateReg, statuteInfo]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-[#0a1317]">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('states')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#0064e0] hover:text-[#0457cb] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 50 State Directory</span>
        </button>
        <span className="text-xs font-mono text-slate-500">
          Route: /legal/{stateReg.slug}
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
              {stateReg.state} DOT Weight Laws &amp; Regulations
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

        {/* Core Statutory Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tight">Single Axle Limit</span>
            <span className="text-lg font-mono font-bold text-[#0a1317]">{stateReg.singleAxleLimitLbs.toLocaleString()} lbs</span>
            <p className="text-[11px] text-slate-500">Maximum non-permit load on any single axle.</p>
          </div>

          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tight">Tandem Axle Limit</span>
            <span className="text-lg font-mono font-bold text-[#0a1317]">{stateReg.tandemAxleLimitLbs.toLocaleString()} lbs</span>
            <p className="text-[11px] text-slate-500">Spacing 40" to 96" between axle centers.</p>
          </div>

          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tight">Tridem Axle Limit</span>
            <span className="text-lg font-mono font-bold text-[#0a1317]">{stateReg.tridemAxleLimitLbs.toLocaleString()} lbs</span>
            <p className="text-[11px] text-slate-500">Three consecutive axles grouped closely.</p>
          </div>

          <div className="p-4 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tight">Permit Portal</span>
            <a
              href={statuteInfo.permitWebsite}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#0064e0] hover:underline flex items-center space-x-1"
            >
              <span>{stateReg.state} DOT Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-[11px] text-slate-500 block">Phone: {statuteInfo.dotPhone}</span>
          </div>
        </div>
      </div>

      {/* State Statutory Rule Summary */}
      <div className="bg-white border border-[#dee3e9] rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#0a1317] flex items-center space-x-2">
          <FileText className="w-5 h-5 text-[#0064e0]" />
          <span>Statutory Details &amp; Operational Exceptions ({stateReg.state})</span>
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed bg-[#f1f4f7] p-4 rounded-2xl border border-[#dee3e9]">
          {stateReg.keyRuleSummary}
        </p>

        {stateReg.tolerancesAndExceptions && stateReg.tolerancesAndExceptions.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase text-slate-600 tracking-wider">
              Enforcement Tolerances &amp; Industry Exemptions
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              {stateReg.tolerancesAndExceptions.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Vehicle Configurations in this State */}
      <div className="bg-white border border-[#dee3e9] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0a1317] flex items-center space-x-2">
            <Scale className="w-5 h-5 text-[#0064e0]" />
            <span>Common Commercial Configurations in {stateReg.state}</span>
          </h2>
          <span className="text-xs text-slate-500">Pre-calculated Compliance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {VEHICLE_PRESETS.slice(0, 6).map((preset) => (
            <button
              key={preset.id}
              onClick={() => openTruckStatePermutation(preset.slug, stateReg.slug)}
              className="p-4 bg-[#f1f4f7] hover:bg-white border border-[#dee3e9] hover:border-[#0064e0] rounded-2xl text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-[#0064e0] uppercase block mb-1">
                  {preset.category}
                </span>
                <h3 className="text-xs font-bold text-[#0a1317] group-hover:text-[#0064e0] transition-colors">
                  {preset.name}
                </h3>
              </div>
              <div className="mt-3 pt-2 border-t border-[#dee3e9] flex items-center justify-between text-[11px] font-bold text-[#0064e0]">
                <span>View {stateReg.abbreviation} Rules</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
