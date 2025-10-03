import { create } from 'zustand';
import { api } from '../lib/api';

export const useGameStore = create((set, get) => ({
  // State
  state: null,
  loading: false,
  error: null,
  autoTicking: false,
  tickInterval: null,

  // Actions
  fetchState: async () => {
    set({ loading: true, error: null });
    try {
      const state = await api.getState();
      set({ state, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  tick: async (days = 1) => {
    try {
      const result = await api.tick(days);
      await get().fetchState();
      return result;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  pause: async (paused) => {
    try {
      await api.pause(paused);
      set((state) => ({
        state: { ...state.state, paused },
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  setSpeed: async (multiplier) => {
    try {
      await api.setSpeed(multiplier);
      set((state) => ({
        state: { ...state.state, speed: multiplier },
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  startAutoTick: () => {
    const state = get().state;
    if (!state || get().autoTicking) return;

    const interval = setInterval(async () => {
      const currentState = get().state;
      if (!currentState?.paused) {
        await get().tick(1);
      }
    }, 1000 / (state.speed || 1));

    set({ autoTicking: true, tickInterval: interval });
  },

  stopAutoTick: () => {
    const interval = get().tickInterval;
    if (interval) {
      clearInterval(interval);
      set({ autoTicking: false, tickInterval: null });
    }
  },

  save: async () => {
    try {
      await api.save();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  load: async () => {
    try {
      await api.load();
      await get().fetchState();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  acquireInventory: async (pack, qty) => {
    try {
      const result = await api.acquireInventory(pack, qty);
      await get().fetchState();
      return result;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  setMarketingSpend: async (perDay) => {
    try {
      await api.setMarketingSpend(perDay);
      await get().fetchState();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  hireStaff: async (role, archetype) => {
    try {
      const result = await api.hireStaff(role, archetype);
      await get().fetchState();
      return result;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  trainStaff: async (id, program) => {
    try {
      await api.trainStaff(id, program);
      await get().fetchState();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
