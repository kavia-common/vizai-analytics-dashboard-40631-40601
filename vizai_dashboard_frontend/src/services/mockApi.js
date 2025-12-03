import { addDays, subDays, startOfDay, addHours, addMinutes, formatISO } from 'date-fns';

const behaviors = ['Pacing', 'Recumbent', 'Scratching', 'Self-directed'];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function seedWeekData() {
  const today = new Date();
  const start = subDays(startOfDay(today), 6);
  /** @type any[] */
  const events = [];
  for (let d = 0; d < 7; d++) {
    const base = addDays(start, d);
    for (let h = 0; h < 24; h++) {
      const perHour = rand(0, 3);
      for (let i = 0; i < perHour; i++) {
        const beh = behaviors[rand(0, behaviors.length - 1)];
        const startMin = rand(0, 59);
        const dur = rand(30, 900);
        const st = addMinutes(addHours(base, h), startMin);
        const et = addMinutes(st, Math.max(1, Math.min(1800, dur)));
        events.push({
          id: `${d}-${h}-${i}-${beh}`,
          behavior_type: beh,
          start_timestamp: formatISO(st),
          end_timestamp: formatISO(et),
          duration_seconds: Math.floor((et - st) / 1000),
          camera_source: ['North', 'South', 'Interior'][rand(0, 2)],
          video_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          thumbnail_url: 'https://placehold.co/160x90?text=Video',
          confidence_score: Math.round((Math.random() * 0.3 + 0.6) * 100) / 100,
          environmental_context: { temp_c: rand(18, 30), humidity: rand(35, 80) },
        });
      }
    }
  }
  // Inject the longest Scratching episode for Story 3
  const longStart = addHours(start, 4);
  const longEnd = addMinutes(longStart, 50); // 3000 seconds approx
  events.push({
    id: 'story3-long-scratching',
    behavior_type: 'Scratching',
    start_timestamp: formatISO(longStart),
    end_timestamp: formatISO(longEnd),
    duration_seconds: Math.floor((longEnd - longStart) / 1000),
    camera_source: 'Interior',
    video_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnail_url: 'https://placehold.co/160x90?text=Long+Clip',
    confidence_score: 0.93,
    environmental_context: { temp_c: 24, humidity: 50 },
  });
  return events.sort((a, b) => a.start_timestamp.localeCompare(b.start_timestamp));
}

const DATA = {
  profile: {
    id: 'anteater-001',
    name: 'Giant Anteater A1',
    species: 'Myrmecophaga tridactyla',
    photo_url: 'https://placehold.co/320x180?text=Giant+Anteater',
    status: 'Normal',
    last_updated: new Date().toISOString(),
  },
  events: seedWeekData(),
};

function summarize(events, startDate, endDate) {
  const inRange = events.filter(e => (!startDate || e.start_timestamp >= startDate) && (!endDate || e.end_timestamp <= endDate));
  const totals = {};
  let totalDuration = 0;
  inRange.forEach(e => {
    totals[e.behavior_type] = totals[e.behavior_type] || { behavior_type: e.behavior_type, count: 0, total_duration_seconds: 0 };
    totals[e.behavior_type].count++;
    totals[e.behavior_type].total_duration_seconds += e.duration_seconds;
    totalDuration += e.duration_seconds;
  });
  return Object.values(totals).map(x => ({
    ...x,
    avg_duration_seconds: x.count ? Math.round(x.total_duration_seconds / x.count) : 0,
    pct_of_period: totalDuration ? Math.round((x.total_duration_seconds / totalDuration) * 1000) / 10 : 0,
  }));
}

// PUBLIC_INTERFACE
export function createMockApi() {
  return {
    async getAnimalProfile() {
      await new Promise(r => setTimeout(r, 150));
      return DATA.profile;
    },
    async getBehaviorSummary({ startDate, endDate }) {
      await new Promise(r => setTimeout(r, 150));
      return summarize(DATA.events, startDate, endDate);
    },
    async getBehaviors(params) {
      await new Promise(r => setTimeout(r, 150));
      const {
        startDate, endDate,
        behaviors: filterBehaviors,
        minDuration = 0, maxDuration = 999999,
        camera = 'any',
        startHour = 0, endHour = 24,
      } = params || {};
      return DATA.events.filter(e => {
        const hour = new Date(e.start_timestamp).getHours();
        return (!startDate || e.start_timestamp >= startDate)
          && (!endDate || e.end_timestamp <= endDate)
          && (!filterBehaviors || filterBehaviors.length === 0 || filterBehaviors.includes(e.behavior_type))
          && e.duration_seconds >= minDuration && e.duration_seconds <= maxDuration
          && (camera === 'any' || e.camera_source === camera)
          && hour >= startHour && hour < endHour;
      });
    },
    async getBehaviorVideo(id) {
      await new Promise(r => setTimeout(r, 120));
      const item = DATA.events.find(e => e.id === id);
      if (!item) throw new Error('Not Found');
      return { stream_url: item.video_url, ...item };
    },
    async postGenerateReport(payload) {
      await new Promise(r => setTimeout(r, 300));
      const key = payload?.client_key || Math.random().toString(36).slice(2);
      return { download_url: `https://example.com/report-${key}.pdf`, job_id: key };
    },
  };
}
