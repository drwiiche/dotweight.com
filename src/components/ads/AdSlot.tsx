import React, { useState } from 'react';
import { Info, ExternalLink, Settings } from 'lucide-react';
import { useAdSenseStore } from '../../store/useAdSenseStore';

interface AdSlotProps {
  placement: 'TopBanner' | 'InLineResults' | 'Sidebar' | 'StickyFooter';
  slotId?: string;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement, slotId: customSlotId, className = '' }) => {
  const {
    enabled,
    publisherId,
    topBannerEnabled,
    sidebarEnabled,
    inlineContentEnabled,
    stickyFooterEnabled,
    topBannerSlotId,
    sidebarSlotId,
    inlineSlotId,
    stickyFooterSlotId,
  } = useAdSenseStore();

  const [adDismissed, setAdDismissed] = useState(false);

  // 1. Check Global AdSense Enable switch
  if (!enabled) return null;

  // 2. Check Placement-specific Enable switch
  if (placement === 'TopBanner' && !topBannerEnabled) return null;
  if (placement === 'Sidebar' && !sidebarEnabled) return null;
  if (placement === 'InLineResults' && !inlineContentEnabled) return null;
  if (placement === 'StickyFooter' && !stickyFooterEnabled) return null;

  if (adDismissed && placement === 'StickyFooter') return null;

  // Determine active slot ID
  let activeSlotId = customSlotId;
  if (!activeSlotId) {
    if (placement === 'TopBanner') activeSlotId = topBannerSlotId;
    if (placement === 'Sidebar') activeSlotId = sidebarSlotId;
    if (placement === 'InLineResults') activeSlotId = inlineSlotId;
    if (placement === 'StickyFooter') activeSlotId = stickyFooterSlotId;
  }

  // Set fixed aspect ratio heights to prevent Cumulative Layout Shift (CLS)
  let heightClass = 'min-h-[90px]';
  let label = 'Sponsored Equipment & Software';

  if (placement === 'TopBanner') {
    heightClass = 'min-h-[90px] md:min-h-[100px]';
  } else if (placement === 'InLineResults') {
    heightClass = 'min-h-[110px]';
  } else if (placement === 'Sidebar') {
    heightClass = 'min-h-[220px]';
  } else if (placement === 'StickyFooter') {
    heightClass = 'h-[50px]';
  }

  return (
    <div className={`w-full overflow-hidden my-6 ${className}`}>
      <div className={`w-full ${heightClass} bg-white border border-[#dee3e9] rounded-2xl p-3.5 flex flex-col justify-between relative group hover:border-[#ced0d4] transition-all shadow-2xs`}>
        
        {/* Ad Header Bar */}
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 tracking-tight">
          <div className="flex items-center space-x-1.5">
            <span className="bg-[#f1f4f7] text-[#0064e0] px-2 py-0.5 rounded-full border border-[#dee3e9] text-[9px] uppercase font-extrabold">
              Sponsored
            </span>
            <span className="text-slate-500 font-medium">{label}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-mono text-[9px] text-slate-400" title="Active Publisher & Slot ID">
              {publisherId ? `${publisherId.slice(0, 10)}...` : 'ca-pub-active'} | Slot: {activeSlotId}
            </span>
            <Info className="w-3 h-3 hover:text-slate-600 cursor-pointer" title="Ad Choices" />
          </div>
        </div>

        {/* Ad Content Box */}
        <div className="flex-1 my-1.5 flex items-center justify-between px-3 sm:px-4 bg-[#f1f4f7]/70 rounded-xl border border-[#dee3e9]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-black text-xs border border-emerald-600/20 shrink-0">
              CAT
            </div>
            <div>
              <div className="text-xs font-bold text-[#0a1317] hover:text-[#0064e0] cursor-pointer flex items-center space-x-1 transition-colors">
                <span>Certified On-Board Air Scale Systems</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-600 hidden sm:block font-medium">
                Eliminate overweight weigh-station fines. Live wireless air gauges & digital scale tickets.
              </p>
            </div>
          </div>

          <a
            href="https://ops.fhwa.dot.gov/freight/sw/index.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0064e0] hover:bg-[#0457cb] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-2xs transition-all shrink-0 ml-2"
          >
            Get Scale Quote
          </a>
        </div>
      </div>
    </div>
  );
};

