import React, { useMemo, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';
import BehaviorDurationChart from '../components/charts/BehaviorDurationChart';
import BehaviorCountsBar from '../components/charts/BehaviorCountsBar';

// PUBLIC_INTERFACE
export default function ReportsPage() {
  const { api, state } = useApp();
  const [type, setType] = useState('daily');
  const [behaviors, setBehaviors] = useState(['Pacing','Recumbent','Scratching','Self-directed']);
  const [style, setStyle] = useState('stacked');
  const [email, setEmail] = useState('keeper@example.org');
  const [generating, setGenerating] = useState(false);
  const [download, setDownload] = useState(null);

  const dateParams = useMemo(() => toDateParams(state.datePreset, state.dateRange), [state.datePreset, state.dateRange]);

  // Load preview data via mock api methods
  const [summary, setSummary] = useState([]);
  useMemo(() => {
    let mounted = true;
    api.getBehaviorSummary(dateParams).then(s => { if (mounted) setSummary(s.filter(x => behaviors.includes(x.behavior_type))); });
    return () => { mounted = false; };
  }, [api, dateParams.startDate, dateParams.endDate, behaviors.join(',')]);

  const onGenerate = async () => {
    setGenerating(true);
    setDownload(null);
    try {
      const payload = {
        type,
        behaviors,
        style,
        date: dateParams,
        client_key: `rep_${type}_${dateParams.startDate}_${dateParams.endDate}_${behaviors.join('-')}`,
        schedule: email ? { email, cadence: 'weekly' } : null,
      };
      const res = await api.postGenerateReport(payload);
      setDownload(res.download_url);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card title="Report Builder">
        <div className="form-row" style={{ marginBottom: 12 }}>
          <label className="small">Report Type</label>
          <select className="select" value={type} onChange={(e)=>setType(e.target.value)}>
            <option value="daily">Daily Summary</option>
            <option value="weekly">Weekly Trend</option>
            <option value="monthly">Monthly Trend</option>
            <option value="behavior">Behavior-Specific Analysis</option>
            <option value="welfare">Welfare Assessment</option>
          </select>
          <label className="small">Behaviors</label>
          <select multiple className="select" value={behaviors} onChange={(e)=>setBehaviors(Array.from(e.target.selectedOptions).map(o=>o.value))}>
            {['Pacing','Recumbent','Scratching','Self-directed'].map(b=><option key={b} value={b}>{b}</option>)}
          </select>
          <label className="small">Chart Style</label>
          <select className="select" value={style} onChange={(e)=>setStyle(e.target.value)}>
            <option value="stacked">Stacked Bars</option>
            <option value="pie">Pie</option>
          </select>
          <label className="small">Schedule (email)</label>
          <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="optional" />
          <Button onClick={onGenerate} disabled={generating}>{generating ? 'Generating...' : 'Generate'}</Button>
        </div>
      </Card>

      <Card title="Preview">
        {style === 'stacked' ? <BehaviorDurationChart data={summary} /> : <BehaviorCountsBar data={summary} />}
      </Card>

      {download && (
        <Card title="Export">
          <div className="form-row">
            <a className="btn" href={download} target="_blank" rel="noreferrer">Download PDF</a>
            <a className="btn ghost" href={download.replace('.pdf','.xlsx')} target="_blank" rel="noreferrer">Download Excel</a>
            <a className="btn ghost" href={download.replace('.pdf','.csv')} target="_blank" rel="noreferrer">Download CSV</a>
            <a className="btn ghost" href={download.replace('.pdf','.pptx')} target="_blank" rel="noreferrer">Download PPTX</a>
          </div>
        </Card>
      )}
    </div>
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
