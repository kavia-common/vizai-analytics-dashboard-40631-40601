import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

// PUBLIC_INTERFACE
export default function BehaviorCountsBar({ data, onSelect }) {
  return (
    <Card title="Behavior Counts">
      {(!data || data.length === 0) ? (
        <div className="small">No data for selected range.</div>
      ) : (
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="behavior_type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1E3A8A" onClick={(d) => onSelect && onSelect(d.payload.behavior_type)} cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
