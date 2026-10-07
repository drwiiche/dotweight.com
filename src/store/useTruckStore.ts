import { create } from 'zustand';
import { Axle, VehiclePreset, StateRegulation, ComplianceResult } from '../types/truck';
import { VEHICLE_PRESETS } from '../lib/data/presets';
import { STATE_REGULATIONS } from '../lib/data/states';
import { evaluateTruckCompliance } from '../lib/math/evaluateTruck';

export type ActiveView = 
  | 'calculator'
  | 'presets'
  | 'preset-detail'
  | 'states'
  | 'state-detail'
  | 'guides'
  | 'guide-detail'
  | 'legal'
  | 'tests'
  | 'bridge-table-detail'
  | 'truck-state-detail'
  | 'legal-state-detail'
  | 'cat-scale-decoder'
  | 'pseo-matrix'
  | 'admin-seo-health'
  | '404';

interface TruckStoreState {
  // Navigation State
  activeView: ActiveView;
  activePresetSlug: string;
  activeStateSlug: string;
  activeGuideSlug: string;
  activeLegalTab: 'disclaimer' | 'privacy' | 'terms';

  // pSEO Navigation Parameters
  activePseoVehicleSlug: string;
  activePseoStateSlug: string;
  activeBridgeAxles: number;
  activeBridgeSpacing: number;

  // Truck Configuration State
  selectedPresetId: string;
  axles: Axle[];
  selectedStateSlug: string; // state regulation selected in calculator dropdown
  customMaxGVW?: number;

  // CAT Scale Ticket Quick Input
  catTicket: {
    steerWeight: number;
    driveWeight: number;
    trailerWeight: number;
  };

  // UI state
  isPrintModalOpen: boolean;

  // Actions
  setActiveView: (view: ActiveView, updateUrl?: boolean) => void;
  selectPreset: (presetId: string) => void;
  selectState: (stateSlug: string) => void;
  
  // Axle Modification Actions
  updateAxleWeight: (axleId: string, weightLbs: number) => void;
  stepAxleWeight: (axleId: string, deltaLbs: number) => void;
  updateAxlePosition: (axleId: string, positionInFeet: number) => void;
  addAxle: (groupName: 'steer' | 'drive' | 'pusher' | 'trailer') => void;
  removeAxle: (axleId: string) => void;
  
  // CAT Scale Helper Actions
  setCatTicket: (ticket: { steerWeight: number; driveWeight: number; trailerWeight: number }) => void;
  applyCatTicketToTruck: () => void;

  // Modal Action
  setPrintModalOpen: (open: boolean) => void;

  // Detail view setters
  openPresetDetail: (slug: string) => void;
  openStateDetail: (slug: string) => void;
  openGuideDetail: (slug: string) => void;
  openLegalTab: (tab: 'disclaimer' | 'privacy' | 'terms') => void;

  // pSEO Permutation Setters
  openTruckStatePermutation: (vSlug: string, sSlug: string, updateUrl?: boolean) => void;
  openBridgeTablePermutation: (axles: number, spacing: number, updateUrl?: boolean) => void;
  openLegalStatePermutation: (sSlug: string, updateUrl?: boolean) => void;

  // Calculated Compliance Result (derived)
  getComplianceResult: () => ComplianceResult;
  getSelectedStateReg: () => StateRegulation;
  getSelectedPreset: () => VehiclePreset | undefined;
}

const VIEW_PATHS: Partial<Record<ActiveView, string>> = {
  'calculator': '/',
  'presets': '/presets',
  'states': '/legal-states',
  'guides': '/guides',
  'legal': '/legal',
  'tests': '/tests',
  'cat-scale-decoder': '/cat-scale-decoder',
  'pseo-matrix': '/pseo-matrix',
  'bridge-table-detail': '/bridge-table',
  'admin-seo-health': '/admin/seo-health',
};

function parseInitialRoute(): {
  view: ActiveView;
  vehicleSlug: string;
  stateSlug: string;
  bridgeAxles: number;
  bridgeSpacing: number;
} {
  if (typeof window === 'undefined') {
    return {
      view: 'calculator',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/') {
    return {
      view: 'calculator',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  if (path.startsWith('/trucks/')) {
    const parts = path.replace('/trucks/', '').split('/').filter(Boolean);
    if (parts.length >= 2) {
      return {
        view: 'truck-state-detail',
        vehicleSlug: parts[0].toLowerCase(),
        stateSlug: parts[1].toLowerCase(),
        bridgeAxles: 5,
        bridgeSpacing: 51,
      };
    }
  }

  if (path.startsWith('/legal/')) {
    const raw = path.replace('/legal/', '').replace(/-dot-weight-laws$/, '').toLowerCase();
    return {
      view: 'legal-state-detail',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: raw || 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  if (path.startsWith('/bridge-table/')) {
    const parts = path.replace('/bridge-table/', '').split('-ft')[0].split('-axles-');
    if (parts.length === 2) {
      return {
        view: 'bridge-table-detail',
        vehicleSlug: '53-foot-semi-truck',
        stateSlug: 'california',
        bridgeAxles: parseInt(parts[0], 10) || 5,
        bridgeSpacing: parseInt(parts[1], 10) || 51,
      };
    }
    return {
      view: 'bridge-table-detail',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  if (path === '/cat-scale-decoder') {
    return {
      view: 'cat-scale-decoder',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  if (path === '/pseo-matrix' || path === '/sitemap-matrix') {
    return {
      view: 'pseo-matrix',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  if (path === '/legal-states' || path === '/states') {
    return {
      view: 'states',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  if (path === '/presets') {
    return {
      view: 'presets',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  if (path === '/guides') {
    return {
      view: 'guides',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  if (path === '/bridge-table') {
    return {
      view: 'bridge-table-detail',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  if (path === '/legal') {
    return {
      view: 'legal',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  if (path === '/tests') {
    return {
      view: 'tests',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  if (path.startsWith('/admin')) {
    return {
      view: 'admin-seo-health',
      vehicleSlug: '53-foot-semi-truck',
      stateSlug: 'california',
      bridgeAxles: 5,
      bridgeSpacing: 51,
    };
  }

  return {
    view: '404',
    vehicleSlug: '53-foot-semi-truck',
    stateSlug: 'california',
    bridgeAxles: 5,
    bridgeSpacing: 51,
  };
}

const initialRoute = parseInitialRoute();

export const useTruckStore = create<TruckStoreState>((set, get) => ({
  activeView: initialRoute.view,
  activePresetSlug: VEHICLE_PRESETS[0].slug,
  activeStateSlug: initialRoute.stateSlug,
  activeGuideSlug: 'federal-bridge-formula-b-math-guide',
  activeLegalTab: 'disclaimer',

  activePseoVehicleSlug: initialRoute.vehicleSlug,
  activePseoStateSlug: initialRoute.stateSlug,
  activeBridgeAxles: initialRoute.bridgeAxles,
  activeBridgeSpacing: initialRoute.bridgeSpacing,

  selectedPresetId: VEHICLE_PRESETS[0].id,
  axles: JSON.parse(JSON.stringify(VEHICLE_PRESETS[0].axles)),
  selectedStateSlug: initialRoute.stateSlug || 'federal-interstate',
  customMaxGVW: undefined,

  catTicket: {
    steerWeight: 12000,
    driveWeight: 34000,
    trailerWeight: 34000,
  },

  isPrintModalOpen: false,

  setActiveView: (view, updateUrl = true) => {
    if (updateUrl && typeof window !== 'undefined') {
      const targetPath = VIEW_PATHS[view];
      if (targetPath && window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
    set({ activeView: view });
  },

  selectPreset: (presetId) => {
    const preset = VEHICLE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      set({
        selectedPresetId: presetId,
        axles: JSON.parse(JSON.stringify(preset.axles)),
        customMaxGVW: preset.recommendedGVW,
      });
    }
  },

  selectState: (stateSlug) => set({ selectedStateSlug: stateSlug }),

  updateAxleWeight: (axleId, weightLbs) => {
    const safeWeight = Math.max(0, Math.min(60000, Math.round(weightLbs)));
    set((state) => ({
      axles: state.axles.map((ax) =>
        ax.id === axleId ? { ...ax, weightLbs: safeWeight } : ax
      ),
    }));
  },

  stepAxleWeight: (axleId, deltaLbs) => {
    set((state) => ({
      axles: state.axles.map((ax) =>
        ax.id === axleId
          ? { ...ax, weightLbs: Math.max(0, Math.min(60000, ax.weightLbs + deltaLbs)) }
          : ax
      ),
    }));
  },

  updateAxlePosition: (axleId, positionInFeet) => {
    const safePos = Math.max(0, Math.min(100, Math.round(positionInFeet * 10) / 10));
    set((state) => ({
      axles: state.axles.map((ax) =>
        ax.id === axleId ? { ...ax, positionInFeet: safePos } : ax
      ),
    }));
  },

  addAxle: (groupName) => {
    const state = get();
    const existing = state.axles;
    const maxPos = existing.length > 0 ? Math.max(...existing.map(a => a.positionInFeet)) : 0;
    const newPos = Math.round((maxPos + 4.3) * 10) / 10;
    
    const newAxle: Axle = {
      id: `ax-custom-${Date.now()}`,
      name: `New ${groupName.toUpperCase()} Axle`,
      groupName,
      positionInFeet: newPos,
      weightLbs: groupName === 'pusher' ? 10000 : 17000,
      isLiftAxle: groupName === 'pusher',
    };

    set({ axles: [...existing, newAxle] });
  },

  removeAxle: (axleId) => {
    const existing = get().axles;
    if (existing.length <= 2) return; // Keep at least 2 axles for bridge formula
    set({ axles: existing.filter(a => a.id !== axleId) });
  },

  setCatTicket: (ticket) => set({ catTicket: ticket }),

  applyCatTicketToTruck: () => {
    const { steerWeight, driveWeight, trailerWeight } = get().catTicket;
    const axles = [...get().axles];

    // Find steer axles, drive axles, trailer axles and split weight proportionally
    const steerAxles = axles.filter(a => a.groupName === 'steer');
    const driveAxles = axles.filter(a => a.groupName === 'drive');
    const trailerAxles = axles.filter(a => a.groupName === 'trailer');

    if (steerAxles.length > 0) {
      const perAx = Math.round(steerWeight / steerAxles.length);
      steerAxles.forEach(a => a.weightLbs = perAx);
    }
    if (driveAxles.length > 0) {
      const perAx = Math.round(driveWeight / driveAxles.length);
      driveAxles.forEach(a => a.weightLbs = perAx);
    }
    if (trailerAxles.length > 0) {
      const perAx = Math.round(trailerWeight / trailerAxles.length);
      trailerAxles.forEach(a => a.weightLbs = perAx);
    }

    set({ axles });
  },

  setPrintModalOpen: (open) => set({ isPrintModalOpen: open }),

  openPresetDetail: (slug) => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/presets') {
      window.history.pushState({}, '', '/presets');
    }
    set({ activeView: 'preset-detail', activePresetSlug: slug });
  },

  openStateDetail: (slug) => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/legal-states') {
      window.history.pushState({}, '', '/legal-states');
    }
    set({ activeView: 'state-detail', activeStateSlug: slug });
  },

  openGuideDetail: (slug) => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/guides') {
      window.history.pushState({}, '', '/guides');
    }
    set({ activeView: 'guide-detail', activeGuideSlug: slug });
  },

  openLegalTab: (tab) => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/legal') {
      window.history.pushState({}, '', '/legal');
    }
    set({ activeView: 'legal', activeLegalTab: tab });
  },

  openTruckStatePermutation: (vSlug, sSlug, updateUrl = true) => {
    const cleanV = vSlug.toLowerCase();
    const cleanS = sSlug.toLowerCase();
    const targetUrl = `/trucks/${cleanV}/${cleanS}`;
    if (updateUrl && typeof window !== 'undefined' && window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    set({
      activeView: 'truck-state-detail',
      activePseoVehicleSlug: cleanV,
      activePseoStateSlug: cleanS,
    });
  },

  openBridgeTablePermutation: (axles, spacing, updateUrl = true) => {
    const targetUrl = `/bridge-table/${axles}-axles-${spacing}-ft`;
    if (updateUrl && typeof window !== 'undefined' && window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    set({
      activeView: 'bridge-table-detail',
      activeBridgeAxles: axles,
      activeBridgeSpacing: spacing,
    });
  },

  openLegalStatePermutation: (sSlug, updateUrl = true) => {
    const cleanS = sSlug.replace(/-dot-weight-laws$/, '').toLowerCase();
    const targetUrl = `/legal/${cleanS}`;
    if (updateUrl && typeof window !== 'undefined' && window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    set({
      activeView: 'legal-state-detail',
      activePseoStateSlug: cleanS,
    });
  },

  getSelectedStateReg: () => {
    const slug = get().selectedStateSlug;
    return STATE_REGULATIONS.find(s => s.slug === slug) || STATE_REGULATIONS[0];
  },

  getSelectedPreset: () => {
    const id = get().selectedPresetId;
    return VEHICLE_PRESETS.find(p => p.id === id);
  },

  getComplianceResult: () => {
    const { axles, customMaxGVW } = get();
    const stateReg = get().getSelectedStateReg();
    return evaluateTruckCompliance(axles, customMaxGVW, stateReg);
  },
}));
