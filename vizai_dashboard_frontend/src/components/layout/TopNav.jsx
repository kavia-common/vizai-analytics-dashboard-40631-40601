import React from 'react';
import { NavLink } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function TopNav() {
  /** Top navigation bar styled per css_specs.md and style_guide.md */
  return (
    <div className="top-nav" role="navigation" aria-label="Main">
      <div className="nav-brand" aria-label="VizAI Brand">
        <span aria-hidden="true">◆</span>
        <span>VizAI</span>
      </div>
      <div className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/timeline" className={({ isActive }) => isActive ? 'active' : ''}>Timeline</NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>Reports</NavLink>
        <NavLink to="/alerts" className={({ isActive }) => isActive ? 'active' : ''}>Alerts</NavLink>
      </div>
      <div />
    </div>
  );
}
