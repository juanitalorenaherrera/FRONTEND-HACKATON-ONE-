import { create } from 'zustand';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Modals
  modals: {
    addPet: boolean;
    editPet: boolean;
    deletePet: boolean;
    createBooking: boolean;
    checkout: boolean;
    addPaymentMethod: boolean;
  };
  
  // Loading states
  globalLoading: boolean;
  
  // Theme
  theme: 'light' | 'dark';
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  closeAllModals: () => void;
  
  setGlobalLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  sidebarOpen: true,
  sidebarCollapsed: false,
  
  modals: {
    addPet: false,
    editPet: false,
    deletePet: false,
    createBooking: false,
    checkout: false,
    addPaymentMethod: false,
  },
  
  globalLoading: false,
  theme: 'light',

  // Sidebar actions
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
  
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  
  setSidebarCollapsed: (collapsed: boolean) => set({ 
    sidebarCollapsed: collapsed 
  }),

  // Modal actions
  openModal: (modal: keyof UIState['modals']) => set((state) => ({
    modals: { ...state.modals, [modal]: true }
  })),
  
  closeModal: (modal: keyof UIState['modals']) => set((state) => ({
    modals: { ...state.modals, [modal]: false }
  })),
  
  closeAllModals: () => set((state) => ({
    modals: Object.keys(state.modals).reduce((acc, key) => ({
      ...acc,
      [key]: false
    }), {} as UIState['modals'])
  })),

  // Global actions
  setGlobalLoading: (loading: boolean) => set({ globalLoading: loading }),
  
  setTheme: (theme: 'light' | 'dark') => set({ theme }),
}));