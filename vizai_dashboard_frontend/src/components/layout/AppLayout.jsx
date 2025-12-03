import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Icon from '../common/Icon';

function Header() {
  const { state, setDatePreset } = useApp();
  const profile = state.animal;
  return (
    <div className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <strong>VizAI Dashboard</strong>
        {profile && (
          <>
            <span className="small">|</span>
            <span>{profile.name} ({profile.species})</span>
            <Badge tone={profile.status === 'Normal' ? 'success' : profile.status === 'Alert' ? 'error' : 'info'}>
              Status: {profile.status}
            </Badge>
            <span className="small">Last updated {new Date(profile.last_updated).toLocaleString()}</span>
          </>
        )}
      </div>
      <div className="form-row">
        <select
          aria-label="Date Range"
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
    </div>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Navigation</div>
      <nav>
        <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/animals">
          <Icon name="animal" /> Animals
        </NavLink>
        <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/dashboard">
          <Icon name="dashboard" /> Overview
        </NavLink>
        <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/timeline">
          <Icon name="timeline" /> Timeline
        </NavLink>
        <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/reports">
          <Icon name="reports" /> Reports
        </NavLink>
      </nav>
      <div style={{ marginTop: 24 }}>
        <Button variant="ghost" onClick={() => navigate('/auth')} aria-label="Sign out">
          <Icon name="user" /> Sign out
        </Button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <Header />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
