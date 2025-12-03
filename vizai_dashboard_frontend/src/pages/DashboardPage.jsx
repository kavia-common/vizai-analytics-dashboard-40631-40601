import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BehaviorCountsBar from '../components/charts/BehaviorCountsBar';
import BehaviorDurationChart from '../components/charts/BehaviorDurationChart';
import DailyActivityHeatmap from '../components/charts/DailyActivityHeatmap';
import Card from '../components/common/Card';
import FiltersPanel from '../components/common/FiltersPanel';

// PUBLIC_INTERFACE
export default function DashboardPage() {
  const { api, state, setFilters } = useApp();
  const [summary, setSummary] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const dateParams = toDateParams(state.datePreset, state.dateRange);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.getBehaviorSummary(dateParams),
      api.getBehaviors({ ...dateParams }),
    ]).then(([sum, list]) => {
      if (!active) return;
      setSummary(sum);
      setEvents(list);
    });
    return () => { active = false; };
  }, [api, state.datePreset, state.dateRange]);

  const onBarSelect = (behavior) => {
    setFilters({ behaviors: [behavior] });
    navigate('/timeline');
  };

  return (
    <>
      <div>
        <FiltersPanel />
      </div>
      <div>
        <div className="content-card">
          <div className="section-header">
            <h2 style={{ margin: 0 }}>Select Animal</h2>
            <span className="small" style={{ color: 'var(--text-secondary)' }}>Quick Access</span>
          </div>
          <div className="section-subtext">Choose an animal to view its analytics, or jump into reports.</div>
          <div className="tiles">
            <div className="tile-card">
              <div className="tile-title">Giant Alligator</div>
              <div className="tile-subtitle">My favorite dangerous friend</div>
              <div className="tile-actions">
                <button className="tile-btn-primary">Open</button>
                <button className="tile-btn-muted">Reports</button>
              </div>
            </div>
            <div className="tile-card">
              <div className="tile-title">Giant Anteater A1</div>
              <div className="tile-subtitle">Myrmecophaga tridactyla</div>
              <div className="tile-actions">
                <button className="tile-btn-muted" disabled>Coming Soon</button>
              </div>
            </div>
            <div className="tile-card">
              <div className="tile-title">African Lion</div>
              <div className="tile-subtitle">Panthera leo</div>
              <div className="tile-actions">
                <button className="tile-btn-muted" disabled>Coming Soon</button>
              </div>
            </div>
          </div>

          <div className="inline-form">
            <span className="label">Target Transceiver Number</span>
            <input className="small-input" placeholder="e.g., TX-1024" />
            <button className="btn primary" style={{ height: 36, borderRadius: 999 }}>Search</button>
            <span className="badge-new">NEW!</span>
          </div>
        </div>

        <div style={{ height: 16 }} />
        <div className="content-card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <BehaviorCountsBar data={summary} onSelect={onBarSelect} />
            <BehaviorDurationChart data={summary} />
          </div>
        </div>
        <div style={{ height: 16 }} />
        <div className="content-card">
          <DailyActivityHeatmap summary={summary} events={events} />
          <div className="small" style={{ marginTop: 8 }}>Tip: Click a chart bar to drill down into the Timeline with filters applied.</div>
        </div>
      </div>
    </>
  );
}

function toDateParams(preset, custom) {
  const now = new Date();
  const endDate = now.toISOString();
  let start = new Date();
  if (preset === 'today') {
    start.setHours(0,0,0,0);
  } else if (preset === '7d') {
    start = new Date(now.getTime() - 6 * 86400000);
  } else if (preset === '30d') {
    start = new Date(now.getTime() - 29 * 86400000);
  } else if (preset === 'custom' && custom) {
    return { startDate: custom.start, endDate: custom.end };
  }
  return { startDate: start.toISOString(), endDate };
}
