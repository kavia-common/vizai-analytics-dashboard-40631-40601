function http(base) {
  const fetchJson = async (path, opts = {}) => {
    const res = await fetch(`${base}${path}`, { headers: { 'Content-Type': 'application/json' }, ...opts });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };
  return { fetchJson };
}

// PUBLIC_INTERFACE
export function createApiClient(baseUrl) {
  const { fetchJson } = http(baseUrl);
  return {
    // PUBLIC_INTERFACE
    async getAnimalProfile() {
      return fetchJson('/api/v1/anteater/profile');
    },
    // PUBLIC_INTERFACE
    async getBehaviorSummary(params) {
      const q = new URLSearchParams(params).toString();
      return fetchJson(`/api/v1/anteater/behaviors/summary?${q}`);
    },
    // PUBLIC_INTERFACE
    async getBehaviors(params) {
      const q = new URLSearchParams(params).toString();
      return fetchJson(`/api/v1/anteater/behaviors?${q}`);
    },
    // PUBLIC_INTERFACE
    async getBehaviorVideo(id) {
      return fetchJson(`/api/v1/anteater/behaviors/${id}/video`);
    },
    // PUBLIC_INTERFACE
    async postGenerateReport(payload) {
      return fetchJson(`/api/v1/reports/generate`, { method: 'POST', body: JSON.stringify(payload) });
    },
  };
}
