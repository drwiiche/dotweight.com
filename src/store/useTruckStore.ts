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
  | 'admin-seo-health';

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
  setActiveView: (view: ActiveView) => void;
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
  openTruckStatePermutation: (vSlug: string, sSlug: string) => void;
  openBridgeTablePermutation: (axles: number, spacing: number) => void;
  openLegalStatePermutation: (sSlug: string) => void;

  // Calculated Compliance Result (derived)
  getComplianceResult: () => ComplianceResult;
  getSelectedStateReg: () => StateRegulation;
  getSelectedPreset: () => VehiclePreset | undefined;
}

export const useTruckStore = create<TruckStoreState>((set, get) => ({
  activeView: 'calculator',
  activePresetSlug: VEHICLE_PRESETS[0].slug,
  activeStateSlug: 'california',
  activeGuideSlug: 'federal-bridge-formula-b-math-guide',
  activeLegalTab: 'disclaimer',

  activePseoVehicleSlug: '4-axle-dump-truck-pusher',
  activePseoStateSlug: 'ohio',
  activeBridgeAxles: 5,
  activeBridgeSpacing: 51,

  selectedPresetId: VEHICLE_PRESETS[0].id,
  axles: JSON.parse(JSON.stringify(VEHICLE_PRESETS[0].axles)),
  selectedStateSlug: 'federal-interstate',
  customMaxGVW: undefined,

  catTicket: {
    steerWeight: 12000,
    driveWeight: 34000,
    trailerWeight: 34000,
  },

  isPrintModalOpen: false,

  setActiveView: (view) => set({ activeView: view }),

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

  openPresetDetail: (slug) => set({ activeView: 'preset-detail', activePresetSlug: slug }),
  openStateDetail: (slug) => set({ activeView: 'state-detail', activeStateSlug: slug }),
  openGuideDetail: (slug) => set({ activeView: 'guide-detail', activeGuideSlug: slug }),
  openLegalTab: (tab) => set({ activeView: 'legal', activeLegalTab: tab }),

  openTruckStatePermutation: (vSlug, sSlug) =>
    set({
      activeView: 'truck-state-detail',
      activePseoVehicleSlug: vSlug,
      activePseoStateSlug: sSlug,
    }),

  openBridgeTablePermutation: (axles, spacing) =>
    set({
      activeView: 'bridge-table-detail',
      activeBridgeAxles: axles,
      activeBridgeSpacing: spacing,
    }),

  openLegalStatePermutation: (sSlug) =>
    set({
      activeView: 'legal-state-detail',
      activePseoStateSlug: sSlug,
    }),

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
