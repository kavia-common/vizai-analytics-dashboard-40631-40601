import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BehaviorCountsBar from '../components/charts/BehaviorCountsBar';
import BehaviorDurationChart from '../components/charts/BehaviorDurationChart';
import DailyActivityHeatmap from '../components/charts/DailyActivityHeatmap';
import Card from '../components/common/Card';

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
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <BehaviorCountsBar data={summary} onSelect={onBarSelect} />
        <BehaviorDurationChart data={summary} />
      </div>
      <DailyActivityHeatmap summary={summary} events={events} />
      <Card>
        <div className="small">Tip: Click a chart bar to drill down into the Timeline with filters applied.</div>
      </Card>
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
