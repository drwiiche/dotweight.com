import React, { useEffect } from 'react';
import { useTruckStore } from './store/useTruckStore';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LegalBanner } from './components/LegalBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdSlot } from './components/ads/AdSlot';
import { Visualizer } from './components/calculator/Visualizer';
import { Controls } from './components/calculator/Controls';
import { ResultsCard } from './components/calculator/ResultsCard';
import { ScaleTicketInput } from './components/calculator/ScaleTicketInput';
import { PrintSummaryModal } from './components/calculator/PrintSummaryModal';
import { PresetsView } from './components/views/PresetsView';
import { StatesView } from './components/views/StatesView';
import { GuidesView } from './components/views/GuidesView';
import { LegalView } from './components/views/LegalView';
import { TestRunnerView } from './components/views/TestRunnerView';
import { BridgeTableView } from './components/views/BridgeTableView';
import { TruckStatePseoView } from './components/views/TruckStatePseoView';
import { LegalStatePseoView } from './components/views/LegalStatePseoView';
import { CatScaleDecoderView } from './components/views/CatScaleDecoderView';
import { PseoMatrixView } from './components/views/PseoMatrixView';
import { SeoHealthAdminView } from './components/views/SeoHealthAdminView';
import { NotFoundView } from './components/views/NotFoundView';
import { STATE_REGULATIONS } from './lib/data/states';
import { VEHICLE_PRESETS } from './lib/data/presets';

export default function App() {
  const {
    activeView,
    activePseoVehicleSlug,
    activePseoStateSlug,
    activeBridgeAxles,
    activeBridgeSpacing,
    openBridgeTablePermutation,
    openTruckStatePermutation,
    openLegalStatePermutation,
    setActiveView,
  } = useTruckStore();

  // Route dispatcher handling popstate (browser Back/Forward)
  useEffect(() => {
    const handleRoute = () => {
      const rawPath = window.location.pathname.replace(/\/+$/, '') || '/';

      if (rawPath === '/' || rawPath === '') {
        setActiveView('calculator', false);
      } else if (rawPath.startsWith('/bridge-table/')) {
        const parts = rawPath.replace('/bridge-table/', '').split('-ft')[0].split('-axles-');
        if (parts.length === 2) {
          const axles = parseInt(parts[0], 10) || 5;
          const spacing = parseInt(parts[1], 10) || 51;
          openBridgeTablePermutation(axles, spacing, false);
        } else {
          setActiveView('bridge-table-detail', false);
        }
      } else if (rawPath === '/bridge-table') {
        setActiveView('bridge-table-detail', false);
      } else if (rawPath.startsWith('/trucks/')) {
        const parts = rawPath.replace('/trucks/', '').split('/').filter(Boolean);
        if (parts.length >= 2) {
          const vSlug = parts[0].toLowerCase();
          const sSlug = parts[1].toLowerCase();
          const validVehicle = VEHICLE_PRESETS.some((v) => v.slug === vSlug);
          const validState = STATE_REGULATIONS.some((s) => s.slug === sSlug);
          if (validVehicle && validState) {
            openTruckStatePermutation(vSlug, sSlug, false);
          } else {
            setActiveView('404', false);
          }
        } else {
          setActiveView('404', false);
        }
      } else if (rawPath.startsWith('/legal/')) {
        const raw = rawPath.replace('/legal/', '').replace(/-dot-weight-laws$/, '').toLowerCase();
        const validState = STATE_REGULATIONS.some((s) => s.slug === raw);
        if (validState) {
          // Normalize legacy URL format silently
          if (window.location.pathname.includes('-dot-weight-laws')) {
            window.history.replaceState({}, '', `/legal/${raw}`);
          }
          openLegalStatePermutation(raw, false);
        } else {
          setActiveView('404', false);
        }
      } else if (rawPath === '/cat-scale-decoder') {
        setActiveView('cat-scale-decoder', false);
      } else if (rawPath === '/pseo-matrix' || rawPath === '/sitemap-matrix') {
        setActiveView('pseo-matrix', false);
      } else if (rawPath === '/legal-states' || rawPath === '/states') {
        setActiveView('states', false);
      } else if (rawPath === '/presets') {
        setActiveView('presets', false);
      } else if (rawPath === '/guides') {
        setActiveView('guides', false);
      } else if (rawPath === '/legal') {
        setActiveView('legal', false);
      } else if (rawPath === '/tests') {
        setActiveView('tests', false);
      } else if (rawPath.startsWith('/admin')) {
        setActiveView('admin-seo-health', false);
      } else {
        setActiveView('404', false);
      }
    };

    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, [openBridgeTablePermutation, openTruckStatePermutation, openLegalStatePermutation, setActiveView]);

  // Keep Canonical Link Tag synchronized with current URL path
  useEffect(() => {
    const canonicalLink = document.getElementById('canonical-url') || document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      let currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
      currentPath = currentPath.replace(/-dot-weight-laws$/, '');
      canonicalLink.setAttribute('href', `https://www.dotweight.com${currentPath}`);
    }
  }, [activeView, activePseoVehicleSlug, activePseoStateSlug, activeBridgeAxles, activeBridgeSpacing]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Global Responsive Navigation Header */}
      <Header />

      {/* Main App Canvas & Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 md:pb-12">
        {/* Top AdSlot */}
        <AdSlot placement="TopBanner" />

        {/* View Router */}
        {activeView === 'calculator' && (
          <div className="space-y-6">
            {/* Semantic Header for Search Engines */}
            <header className="text-center max-w-3xl mx-auto space-y-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Federal Bridge Formula &amp; DOT Axle Weight Calculator
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Interactive compliance engine calculating 23 CFR § 658.17 Bridge Formula B, steer/drive/trailer tandem limits, and state weight rules.
              </p>
            </header>

            {/* 1. Interactive Mobile-First Canvas (SVG Truck Visualizer) */}
            <Visualizer />

            {/* 2. CAT Scale Ticket Quick Loader */}
            <ScaleTicketInput />

            {/* 3. Controls & Axle Weight Steppers (+/- 500 lbs & Spacings) */}
            <Controls />

            {/* 4. Subgroup Breakdown & Compliance Output */}
            <ResultsCard />

            <AdSlot placement="InLineResults" />
          </div>
        )}

        {(activeView === 'presets' || activeView === 'preset-detail') && <PresetsView />}

        {(activeView === 'states' || activeView === 'state-detail') && <StatesView />}

        {(activeView === 'guides' || activeView === 'guide-detail') && <GuidesView />}

        {activeView === 'legal' && <LegalView />}

        {activeView === 'tests' && <TestRunnerView />}

        {activeView === 'bridge-table-detail' && (
          <BridgeTableView axlesCount={activeBridgeAxles} spacingFeet={activeBridgeSpacing} />
        )}

        {activeView === 'truck-state-detail' && (
          <TruckStatePseoView vehicleSlug={activePseoVehicleSlug} stateSlug={activePseoStateSlug} />
        )}

        {activeView === 'legal-state-detail' && (
          <LegalStatePseoView stateSlug={activePseoStateSlug} />
        )}

        {activeView === 'cat-scale-decoder' && <CatScaleDecoderView />}

        {activeView === 'pseo-matrix' && <PseoMatrixView />}

        {activeView === 'admin-seo-health' && <SeoHealthAdminView />}

        {activeView === '404' && <NotFoundView />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Bottom Quick Action Navigation Bar */}
      <MobileBottomNav />

      {/* Persistent Bottom Legal Disclaimer Banner */}
      <LegalBanner />

      {/* Printable PDF Summary Modal */}
      <PrintSummaryModal />
    </div>
  );
}
