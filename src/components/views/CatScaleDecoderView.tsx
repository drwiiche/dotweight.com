import React, { useState, useEffect } from 'react';
import { Scale, CheckCircle2, AlertTriangle, Copy, ExternalLink, Share2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useTruckStore } from '../../store/useTruckStore';
import { STATE_REGULATIONS } from '../../lib/data/states';
import { injectPseoMetadata } from '../../lib/pseo/schemaGenerator';

export function CatScaleDecoderView() {
  const { selectState, selectedStateSlug, setCatTicket, applyCatTicketToTruck, setActiveView } = useTruckStore();

  const [ticketNum, setTicketNum] = useState('CAT-9842104');
  const [scaleLocation, setScaleLocation] = useState('I-80 Exit 201 - Walcott, IA');
  const [steerWeight, setSteerWeight] = useState(11800);
  const [driveWeight, setDriveWeight] = useState(33600);
  const [trailerWeight, setTrailerWeight] = useState(33800);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBbcode, setCopiedBbcode] = useState(false);

  const selectedState = STATE_REGULATIONS.find((s) => s.slug === selectedStateSlug) || STATE_REGULATIONS[0];

  const totalGross = steerWeight + driveWeight + trailerWeight;

  // Evaluate against limits
  const isSteerPass = steerWeight <= selectedState.steerAxleLimitLbs;
  const isDrivePass = driveWeight <= selectedState.tandemAxleLimitLbs;
  const isTrailerPass = trailerWeight <= selectedState.tandemAxleLimitLbs;
  const isGrossPass = totalGross <= selectedState.maxGVWStandardLbs;

  const isFullyCompliant = isSteerPass && isDrivePass && isTrailerPass && isGrossPass;

  useEffect(() => {
    injectPseoMetadata({
      title: 'CAT Scale Ticket Decoder & Compliance Verification Badge',
      description: 'Decode your CAT Scale ticket weights instantly. Verify legal axle compliance against Federal Bridge Formula B and generate a shareable Scale Verification Badge.',
      breadcrumbs: [
        { name: 'Home', item: '/' },
        { name: 'CAT Scale Ticket Decoder', item: '/cat-scale-decoder' },
      ],
      faqs: [
        {
          question: 'How do I decode my CAT scale ticket steer, drive, and trailer weights?',
          answer: 'Enter your ticket numbers into the CAT Scale Decoder tool. It automatically checks steer, drive tandem, trailer tandem, and total gross vehicle weight against DOT bridge formula limits.',
        },
        {
          question: 'What happens if my drive tandem is 34,800 lbs on a CAT Scale?',
          answer: 'You are 800 lbs overweight on your drive tandem. Slide your trailer tandems forward or shift weight off the drive group before passing a state weigh station.',
        },
      ],
    });
  }, [ticketNum, selectedStateSlug]);

  const handleApplyToCalculator = () => {
    setCatTicket({ steerWeight, driveWeight, trailerWeight });
    applyCatTicketToTruck();
    setActiveView('calculator');
  };

  const badgeShareUrl = `${window.location.origin}/cat-scale-decoder?ticket=${encodeURIComponent(
    ticketNum
  )}&steer=${steerWeight}&drive=${driveWeight}&trailer=${trailerWeight}&state=${selectedStateSlug}`;

  const bbcodeSnippet = `[url=${badgeShareUrl}][img]https://axleguard.org/badge/${ticketNum}.png[/img][/url]\n[b]CAT Scale Verification:[/b] Ticket #${ticketNum} - ${
    isFullyCompliant ? 'PASS (80k Legal)' : 'FAIL (Overweight)'
  } - Gross: ${totalGross.toLocaleString()} lbs (${selectedState.state})`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(badgeShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyBbcode = () => {
    navigator.clipboard.writeText(bbcodeSnippet);
    setCopiedBbcode(true);
    setTimeout(() => setCopiedBbcode(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-[#0a1317]">
      {/* Header Banner */}
      <div className="bg-[#0a1317] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-[#0a1317]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0064e0]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#0064e0]/20 border border-[#0064e0]/40 text-[#0091ff] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight mb-3">
              <Scale className="w-3.5 h-3.5" />
              <span>Guerrilla Scale Tool</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              CAT Scale Ticket Decoder & Verification Badge
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl">
              Type in your CAT scale ticket weights (Steer, Drive, Trailer) to decode instant DOT compliance and generate a verified digital scale badge to share on r/Truckers and TruckersReport.
            </p>
          </div>
          <button
            onClick={handleApplyToCalculator}
            className="bg-[#0064e0] hover:bg-[#0457cb] text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-lg transition-all flex items-center justify-center space-x-2 shrink-0 tracking-tight"
          >
            <span>Open in Live Visualizer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-white border border-[#dee3e9] rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-[#0a1317] tracking-tight flex items-center space-x-2 border-b border-[#dee3e9] pb-3">
            <Scale className="w-5 h-5 text-[#0064e0]" />
            <span>Ticket Information</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Scale Jurisdiction</label>
              <select
                value={selectedStateSlug}
                onChange={(e) => selectState(e.target.value)}
                className="w-full bg-[#f1f4f7] border border-[#dee3e9] rounded-xl px-3 py-2.5 font-medium text-[#0a1317] focus:outline-none focus:ring-2 focus:ring-[#0064e0]"
              >
                {STATE_REGULATIONS.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.state} ({s.abbreviation})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ticket Reference #</label>
                <input
                  type="text"
                  value={ticketNum}
                  onChange={(e) => setTicketNum(e.target.value)}
                  className="w-full bg-[#f1f4f7] border border-[#dee3e9] rounded-xl px-3 py-2 font-mono text-[#0a1317] font-bold focus:outline-none focus:ring-2 focus:ring-[#0064e0]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Scale Location</label>
                <input
                  type="text"
                  value={scaleLocation}
                  onChange={(e) => setScaleLocation(e.target.value)}
                  className="w-full bg-[#f1f4f7] border border-[#dee3e9] rounded-xl px-3 py-2 font-medium text-[#0a1317] focus:outline-none focus:ring-2 focus:ring-[#0064e0]"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-700">Platform 1: Steer Axle</span>
                  <span className="font-mono text-xs text-slate-500">Max {selectedState.steerAxleLimitLbs.toLocaleString()} lbs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="100"
                    value={steerWeight}
                    onChange={(e) => setSteerWeight(Number(e.target.value))}
                    className="w-full bg-white border border-[#dee3e9] rounded-xl px-3 py-2 font-mono text-sm font-bold text-[#0a1317]"
                  />
                  <span className="font-bold text-slate-500">lbs</span>
                </div>
              </div>

              <div className="p-3 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-700">Platform 2: Drive Tandem</span>
                  <span className="font-mono text-xs text-slate-500">Max {selectedState.tandemAxleLimitLbs.toLocaleString()} lbs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="100"
                    value={driveWeight}
                    onChange={(e) => setDriveWeight(Number(e.target.value))}
                    className="w-full bg-white border border-[#dee3e9] rounded-xl px-3 py-2 font-mono text-sm font-bold text-[#0a1317]"
                  />
                  <span className="font-bold text-slate-500">lbs</span>
                </div>
              </div>

              <div className="p-3 bg-[#f1f4f7] border border-[#dee3e9] rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-700">Platform 3: Trailer Tandem</span>
                  <span className="font-mono text-xs text-slate-500">Max {selectedState.tandemAxleLimitLbs.toLocaleString()} lbs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="100"
                    value={trailerWeight}
                    onChange={(e) => setTrailerWeight(Number(e.target.value))}
                    className="w-full bg-white border border-[#dee3e9] rounded-xl px-3 py-2 font-mono text-sm font-bold text-[#0a1317]"
                  />
                  <span className="font-bold text-slate-500">lbs</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#0a1317] text-white rounded-2xl flex items-center justify-between">
              <span className="font-bold">Calculated Gross Weight:</span>
              <span className="font-mono text-lg font-bold text-[#0091ff]">{totalGross.toLocaleString()} lbs</span>
            </div>
          </div>
        </div>

        {/* Output & Share Badge Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Digital Scale Badge Box */}
          <div className="bg-white border-2 border-[#0a1317] rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-[#0064e0]" />
                <div>
                  <h3 className="font-bold text-base text-[#0a1317] tracking-tight">CAT SCALE VERIFICATION BADGE</h3>
                  <p className="text-[11px] text-slate-500 font-mono">ID: {ticketNum} | {scaleLocation}</p>
                </div>
              </div>
              <span
                className={`text-xs font-bold uppercase px-3.5 py-1.5 rounded-full tracking-tight ${
                  isFullyCompliant
                    ? 'bg-[#31a24c]/10 text-[#31a24c] border border-[#31a24c]/30'
                    : 'bg-[#e41e3f]/10 text-[#e41e3f] border border-[#e41e3f]/30'
                }`}
              >
                {isFullyCompliant ? '100% DOT COMPLIANT' : 'OVERWEIGHT DETECTED'}
              </span>
            </div>

            {/* Breakdown Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-5">
              <div className="p-3 bg-[#f1f4f7] rounded-2xl border border-[#dee3e9]">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Steer Axle</span>
                <span className="font-mono text-sm font-bold block">{steerWeight.toLocaleString()} lbs</span>
                <span className={`text-[10px] font-bold ${isSteerPass ? 'text-[#31a24c]' : 'text-[#e41e3f]'}`}>
                  {isSteerPass ? '✓ Legal' : `✗ +${(steerWeight - selectedState.steerAxleLimitLbs).toLocaleString()} lbs`}
                </span>
              </div>

              <div className="p-3 bg-[#f1f4f7] rounded-2xl border border-[#dee3e9]">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Drive Tandem</span>
                <span className="font-mono text-sm font-bold block">{driveWeight.toLocaleString()} lbs</span>
                <span className={`text-[10px] font-bold ${isDrivePass ? 'text-[#31a24c]' : 'text-[#e41e3f]'}`}>
                  {isDrivePass ? '✓ Legal' : `✗ +${(driveWeight - selectedState.tandemAxleLimitLbs).toLocaleString()} lbs`}
                </span>
              </div>

              <div className="p-3 bg-[#f1f4f7] rounded-2xl border border-[#dee3e9]">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Trailer Tandem</span>
                <span className="font-mono text-sm font-bold block">{trailerWeight.toLocaleString()} lbs</span>
                <span className={`text-[10px] font-bold ${isTrailerPass ? 'text-[#31a24c]' : 'text-[#e41e3f]'}`}>
                  {isTrailerPass ? '✓ Legal' : `✗ +${(trailerWeight - selectedState.tandemAxleLimitLbs).toLocaleString()} lbs`}
                </span>
              </div>

              <div className="p-3 bg-[#f1f4f7] rounded-2xl border border-[#dee3e9]">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Gross GVW</span>
                <span className="font-mono text-sm font-bold block">{totalGross.toLocaleString()} lbs</span>
                <span className={`text-[10px] font-bold ${isGrossPass ? 'text-[#31a24c]' : 'text-[#e41e3f]'}`}>
                  {isGrossPass ? '✓ Legal' : `✗ Over Cap`}
                </span>
              </div>
            </div>

            {/* Advice Note */}
            {!isFullyCompliant && (
              <div className="p-3 bg-[#e41e3f]/10 border border-[#e41e3f]/30 rounded-2xl text-xs text-[#e41e3f] font-medium flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Adjust tandem placement or slide fifth wheel prior to crossing scale. Axle weight exceeds {selectedState.state} limit by{' '}
                  {Math.max(0, driveWeight - selectedState.tandemAxleLimitLbs, trailerWeight - selectedState.tandemAxleLimitLbs).toLocaleString()} lbs.
                </span>
              </div>
            )}

            {isFullyCompliant && (
              <div className="p-3 bg-[#31a24c]/10 border border-[#31a24c]/30 rounded-2xl text-xs text-[#31a24c] font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All platform weights pass {selectedState.state} statutory limits & Federal Bridge Formula B. Ready for scale house inspection.</span>
              </div>
            )}
          </div>

          {/* Share Links Box */}
          <div className="bg-white border border-[#dee3e9] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0a1317] tracking-tight flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-[#0064e0]" />
              <span>Share Verification Badge to Forums & Socials</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Direct Verification Badge URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={badgeShareUrl}
                    className="w-full bg-[#f1f4f7] border border-[#dee3e9] rounded-xl px-3 py-2 font-mono text-xs text-slate-700"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-[#0064e0] hover:bg-[#0457cb] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-1 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Forum BBCode / Reddit Format (r/Truckers)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={bbcodeSnippet}
                    className="w-full bg-[#f1f4f7] border border-[#dee3e9] rounded-xl px-3 py-2 font-mono text-xs text-slate-700"
                  />
                  <button
                    onClick={handleCopyBbcode}
                    className="bg-[#0a1317] hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-1 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedBbcode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
