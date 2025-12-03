import React from 'react';
import { useApp } from '../../context/AppContext';

// PUBLIC_INTERFACE
export default function FiltersPanel() {
  /** Filters card with Species, Age Group, Date Range; wires to global context state */
  const { state, setDatePreset } = useApp();
  const [species, setSpecies] = React.useState('Giant Anteater');
  const [age, setAge] = React.useState('Adult');

  return (
    <aside className="filter-card" aria-label="Filters">
      <div className="title">Filters</div>
      <div className="form-group" style={{ marginBottom: 12 }}>
        <label className="label" htmlFor="species">Select Species</label>
        <select id="species" className="select" value={species} onChange={(e)=>setSpecies(e.target.value)}>
          <option>Giant Anteater</option>
          <option>Alligator</option>
          <option>Scrub Jay</option>
        </select>
      </div>
      <div className="form-group" style={{ marginBottom: 12 }}>
        <label className="label" htmlFor="age">Age Group</label>
        <select id="age" className="select" value={age} onChange={(e)=>setAge(e.target.value)}>
          <option>Adult</option>
          <option>Juvenile</option>
          <option>Senior</option>
        </select>
      </div>
      <div className="form-group" style={{ marginBottom: 16 }}>
        <label className="label" htmlFor="range">Date Range</label>
        <select
          id="range"
          className="select"
          value={state.datePreset}
          onChange={(e) => setDatePreset(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <div className="form-row">
        <button className="btn primary" style={{ height: 40 }} onClick={()=>{ /* mocked apply */ }}>Apply</button>
        <button className="btn secondary" onClick={()=>{ /* mocked reset */ }}>Reset</button>
      </div>
    </aside>
  );
}
