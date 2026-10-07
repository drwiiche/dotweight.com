import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdSenseState {
  enabled: boolean;
  publisherId: string;
  autoAdsEnabled: boolean;
  topBannerEnabled: boolean;
  sidebarEnabled: boolean;
  inlineContentEnabled: boolean;
  stickyFooterEnabled: boolean;
  topBannerSlotId: string;
  sidebarSlotId: string;
  inlineSlotId: string;
  stickyFooterSlotId: string;

  // Actions
  toggleEnabled: () => void;
  setPublisherId: (id: string) => void;
  toggleAutoAds: () => void;
  togglePlacement: (placement: 'topBanner' | 'sidebar' | 'inlineContent' | 'stickyFooter') => void;
  setSlotId: (placement: 'topBanner' | 'sidebar' | 'inlineContent' | 'stickyFooter', slotId: string) => void;
  updateSettings: (settings: Partial<AdSenseState>) => void;
}

export const useAdSenseStore = create<AdSenseState>()(
  persist(
    (set) => ({
      enabled: false, // Default to FALSE so site remains clean unless explicitly activated by admin
      publisherId: 'ca-pub-1234567890123456',
      autoAdsEnabled: false,
      topBannerEnabled: true,
      sidebarEnabled: true,
      inlineContentEnabled: true,
      stickyFooterEnabled: false,
      topBannerSlotId: '9876543210',
      sidebarSlotId: '1234567890',
      inlineSlotId: '5432109876',
      stickyFooterSlotId: '6789012345',

      toggleEnabled: () => set((state) => ({ enabled: !state.enabled })),
      setPublisherId: (publisherId) => set({ publisherId }),
      toggleAutoAds: () => set((state) => ({ autoAdsEnabled: !state.autoAdsEnabled })),
      togglePlacement: (placement) =>
        set((state) => {
          switch (placement) {
            case 'topBanner':
              return { topBannerEnabled: !state.topBannerEnabled };
            case 'sidebar':
              return { sidebarEnabled: !state.sidebarEnabled };
            case 'inlineContent':
              return { inlineContentEnabled: !state.inlineContentEnabled };
            case 'stickyFooter':
              return { stickyFooterEnabled: !state.stickyFooterEnabled };
            default:
              return {};
          }
        }),
      setSlotId: (placement, slotId) =>
        set((state) => {
          switch (placement) {
            case 'topBanner':
              return { topBannerSlotId: slotId };
            case 'sidebar':
              return { sidebarSlotId: slotId };
            case 'inlineContent':
              return { inlineSlotId: slotId };
            case 'stickyFooter':
              return { stickyFooterSlotId: slotId };
            default:
              return {};
          }
        }),
      updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
    }),
    {
      name: 'dotweight-adsense-config',
    }
  )
);
