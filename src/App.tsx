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

  // Initial client-side URL route parsing on mount & window popstate
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;

      if (path === '/' || path === '') {
        setActiveView('calculator');
      } else if (path.startsWith('/bridge-table/')) {
        const parts = path.replace('/bridge-table/', '').split('-ft')[0].split('-axles-');
        if (parts.length === 2) {
          const axles = parseInt(parts[0], 10) || 5;
          const spacing = parseInt(parts[1], 10) || 51;
          openBridgeTablePermutation(axles, spacing);
        } else {
          setActiveView('bridge-table-detail');
        }
      } else if (path === '/bridge-table') {
        setActiveView('bridge-table-detail');
      } else if (path.startsWith('/trucks/')) {
        const parts = path.replace('/trucks/', '').split('/');
        if (parts.length >= 2 && parts[0] && parts[1]) {
          openTruckStatePermutation(parts[0], parts[1]);
        } else {
          setActiveView('404');
        }
      } else if (path.startsWith('/legal/')) {
        const raw = path.replace('/legal/', '').replace(/\/$/, '');
        const stateSlug = raw.replace('-dot-weight-laws', '');
        if (stateSlug) {
          openLegalStatePermutation(stateSlug);
        } else {
          setActiveView('404');
        }
      } else if (path === '/cat-scale-decoder') {
        setActiveView('cat-scale-decoder');
      } else if (path === '/pseo-matrix' || path === '/sitemap-matrix') {
        setActiveView('pseo-matrix');
      } else if (path === '/legal-states' || path === '/states') {
        setActiveView('states');
      } else if (path === '/presets') {
        setActiveView('presets');
      } else if (path === '/guides') {
        setActiveView('guides');
      } else if (path === '/legal') {
        setActiveView('legal');
      } else if (path === '/tests') {
        setActiveView('tests');
      } else if (path.startsWith('/admin')) {
        setActiveView('admin-seo-health');
      } else {
        // Unknown route -> render custom 404 page
        setActiveView('404');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, [openBridgeTablePermutation, openTruckStatePermutation, openLegalStatePermutation, setActiveView]);

  // Keep Canonical Link Tag synchronized with current URL path
  useEffect(() => {
    const canonicalLink = document.getElementById('canonical-url');
    if (canonicalLink) {
      const currentPath = window.location.pathname;
      canonicalLink.setAttribute('href', `https://dotweight.com${currentPath}`);
    }
  }, [activeView]);

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
