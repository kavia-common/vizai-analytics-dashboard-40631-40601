import React, { useMemo } from 'react';
import Card from '../common/Card';

function buildGrid(summary, events) {
  const rows = Array.from(new Set(summary.map(s => s.behavior_type)));
  const map = {};
  rows.forEach(b => map[b] = new Array(24).fill(0));
  (events || []).forEach(e => {
    const h = new Date(e.start_timestamp).getHours();
    map[e.behavior_type][h] += e.duration_seconds;
  });
  return { rows, map };
}

// PUBLIC_INTERFACE
export default function DailyActivityHeatmap({ summary, events }) {
  const grid = useMemo(() => buildGrid(summary || [], events || []), [summary, events]);
  return (
    <Card title="Daily Activity Heatmap (sum duration per hour)">
      {grid.rows.length === 0 ? <div className="small">No data for selected range.</div> : (
        <div className="heatmap-grid" role="grid" aria-label="Daily Activity Heatmap">
          <div></div>
          {Array.from({ length: 24 }).map((_, i) => <div key={i} className="small" style={{ textAlign: 'center' }}>{i}</div>)}
          {grid.rows.map((b) => (
            <React.Fragment key={b}>
              <div className="small">{b}</div>
              {grid.map[b].map((v, i) => (
                <div
                  key={i}
                  className="heat-cell"
                  data-level={bucket(v)}
                  title={`${b} at ${i}:00 • ${Math.round(v)}s`}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </Card>
  );
}

function bucket(v) {
  if (v === 0) return 0;
  if (v < 300) return 1;
  if (v < 900) return 2;
  if (v < 1800) return 3;
  return 4;
}
