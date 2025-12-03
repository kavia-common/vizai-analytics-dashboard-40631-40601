import React, { useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';
import VideoModal from '../components/video/VideoModal';
import FiltersPanel from '../components/common/FiltersPanel';

// PUBLIC_INTERFACE
export default function TimelinePage() {
  const { api, state, setFilters } = useApp();
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(true);
  const [selected, setSelected] = useState(null);

  const dateParams = toDateParams(state.datePreset, state.dateRange);

  const [local, setLocal] = useState(state.filters);

  useEffect(() => {
    setLocal(state.filters);
  }, [state.filters]);

  const load = async () => {
    setBusy(true);
    const res = await api.getBehaviors({
      ...dateParams,
      behaviors: local.behaviors,
      minDuration: local.duration[0],
      maxDuration: local.duration[1],
      camera: local.camera,
      startHour: local.timeOfDay[0],
      endHour: local.timeOfDay[1],
    });
    setItems(res);
    setBusy(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [state.datePreset, state.dateRange, local.behaviors.join(','), local.duration.join('-'), local.camera, local.timeOfDay.join('-')]);

  const applyFilters = () => setFilters(local);
  const clearFilters = () => { const reset = { behaviors: [], duration: [0, 3600], timeOfDay: [0, 24], camera: 'any' }; setLocal(reset); setFilters(reset); };

  const Row = ({ index, style }) => {
    const e = items[index];
    return (
      <div style={{ ...style, padding: 8 }}>
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 12, alignItems: 'center' }}>
            <img src={e.thumbnail_url} alt="thumbnail" width="120" height="68" style={{ borderRadius: 6, objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 600 }}>{e.behavior_type} • {Math.round(e.duration_seconds)}s</div>
              <div className="small">{new Date(e.start_timestamp).toLocaleString()} — Camera: {e.camera_source} — Confidence: {Math.round(e.confidence_score * 100)}%</div>
            </div>
            <Button onClick={() => setSelected(e)}>View Video</Button>
          </div>
        </Card>
      </div>
    );
  };

  const count = items.length;

  return (
    <>
      <div>
        <FiltersPanel />
      </div>
      <div>
        <div className="content-card">
          <div className="section-header">
            <h2 style={{ margin: 0 }}>Timeline</h2>
            <div className="form-row">
              <Button variant="ghost" onClick={()=>{ /* export stub */ }}>Export CSV</Button>
            </div>
          </div>
          <div className="form-row" style={{ marginBottom: 12 }}>
            <label className="label">Behaviors</label>
            <select multiple className="select" value={local.behaviors} onChange={(e) => {
              const opts = Array.from(e.target.selectedOptions).map(o => o.value);
              setLocal({ ...local, behaviors: opts });
            }}>
              {['Pacing','Recumbent','Scratching','Self-directed'].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <label className="label">Duration (sec)</label>
            <input className="input" type="number" min="0" value={local.duration[0]} onChange={(e)=>setLocal({ ...local, duration: [Number(e.target.value), local.duration[1]]})} />
            <span>to</span>
            <input className="input" type="number" min="0" value={local.duration[1]} onChange={(e)=>setLocal({ ...local, duration: [local.duration[0], Number(e.target.value)]})} />
            <label className="label">Time of day</label>
            <input className="input" type="number" min="0" max="24" value={local.timeOfDay[0]} onChange={(e)=>setLocal({ ...local, timeOfDay: [Number(e.target.value), local.timeOfDay[1]]})}/>
            <span>to</span>
            <input className="input" type="number" min="0" max="24" value={local.timeOfDay[1]} onChange={(e)=>setLocal({ ...local, timeOfDay: [local.timeOfDay[0], Number(e.target.value)]})}/>
            <label className="label">Camera</label>
            <select className="select" value={local.camera} onChange={(e)=>setLocal({ ...local, camera: e.target.value })}>
              <option value="any">Any</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="Interior">Interior</option>
            </select>
            <Button onClick={applyFilters}>Apply</Button>
            <Button variant="ghost" onClick={clearFilters}>Reset</Button>
          </div>

          <Card title={`Events (${count})`}>
            {busy ? <div>Loading...</div> : count === 0 ? <div className="small">No data. Try adjusting filters or date range.</div> : (
              <List height={420} itemCount={count} itemSize={110} width="100%">
                {Row}
              </List>
            )}
          </Card>
        </div>
      </div>

      <VideoModal open={!!selected} onClose={()=>setSelected(null)} event={selected || {}} />
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
