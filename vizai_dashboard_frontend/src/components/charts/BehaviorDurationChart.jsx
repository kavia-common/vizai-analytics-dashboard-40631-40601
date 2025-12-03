import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Card from '../common/Card';

const COLORS = ['#1E3A8A', '#3B82F6', '#F59E0B', '#10B981', '#EF4444'];

// PUBLIC_INTERFACE
export default function BehaviorDurationChart({ data }) {
  const [mode, setMode] = useState('stacked');
  const total = (data || []).reduce((a, b) => a + (b.total_duration_seconds || 0), 0);
  const withLabel = (data || []).map(d => ({ ...d, label: `${formatHMS(d.total_duration_seconds)} (${pct(total, d.total_duration_seconds)})` }));

  return (
    <Card
      title="Duration by Behavior"
      action={
        <div className="form-row">
          <button className={`btn ghost`} onClick={() => setMode('stacked')} disabled={mode === 'stacked'}>Stacked</button>
          <button className={`btn ghost`} onClick={() => setMode('pie')} disabled={mode === 'pie'}>Pie</button>
        </div>
      }
    >
      {(!data || data.length === 0) ? (
        <div className="small">No data for selected range.</div>
      ) : mode === 'stacked' ? (
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={withLabel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="behavior_type" />
              <YAxis />
              <Tooltip formatter={(v) => formatHMS(v)} />
              <Bar dataKey="total_duration_seconds" stackId="a" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie dataKey="total_duration_seconds" data={withLabel} label={(e) => e.behavior_type} outerRadius={100}>
                {withLabel.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n, ctx) => `${formatHMS(v)} • ${pct(total, v)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

function formatHMS(sec) {
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
function pct(total, x) {
  if (!total) return '0%';
  return `${Math.round((x / total) * 1000) / 10}%`;
}
