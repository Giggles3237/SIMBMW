const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // State
  async getState() {
    return this.request('/api/state');
  }

  // Game controls
  async tick(days = 1) {
    return this.request('/api/tick', {
      method: 'POST',
      body: JSON.stringify({ days }),
    });
  }

  async pause(paused) {
    return this.request('/api/pause', {
      method: 'POST',
      body: JSON.stringify({ paused }),
    });
  }

  async setSpeed(multiplier) {
    return this.request('/api/speed', {
      method: 'POST',
      body: JSON.stringify({ multiplier }),
    });
  }

  async save() {
    return this.request('/api/save', { method: 'POST' });
  }

  async load() {
    return this.request('/api/load', { method: 'POST' });
  }

  // Inventory
  async acquireInventory(pack, qty) {
    return this.request('/api/inventory/acquire', {
      method: 'POST',
      body: JSON.stringify({ pack, qty }),
    });
  }

  // Marketing
  async setMarketingSpend(perDay) {
    return this.request('/api/marketing/spend', {
      method: 'POST',
      body: JSON.stringify({ perDay }),
    });
  }

  // Staff
  async hireStaff(role, archetype) {
    return this.request('/api/staff/hire', {
      method: 'POST',
      body: JSON.stringify({ role, archetype }),
    });
  }

  async trainStaff(id, program) {
    return this.request('/api/staff/train', {
      method: 'POST',
      body: JSON.stringify({ id, program }),
    });
  }

  // Config
  async getConfig() {
    return this.request('/api/config');
  }

  async updateConfig(coefficients) {
    return this.request('/api/config', {
      method: 'PUT',
      body: JSON.stringify({ coefficients }),
    });
  }

  async loadPreset(preset) {
    return this.request('/api/config/preset', {
      method: 'POST',
      body: JSON.stringify({ preset }),
    });
  }

  // Reports
  async getDailyReports(days = 30) {
    return this.request(`/api/reports/daily?days=${days}`);
  }

  async getMonthlyReports() {
    return this.request('/api/reports/monthly');
  }
}

export const api = new ApiClient();
