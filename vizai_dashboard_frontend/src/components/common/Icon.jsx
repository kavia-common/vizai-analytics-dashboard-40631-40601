import React from 'react';

// PUBLIC_INTERFACE
export default function Icon({ name, size = 18 }) {
  const map = {
    dashboard: '📊',
    timeline: '⏱️',
    reports: '📑',
    animal: '🦣',
    user: '👤',
    play: '▶️',
    error: '⚠️',
    success: '✅',
  };
  return <span aria-hidden="true" style={{ fontSize: size }}>{map[name] || '⬜'}</span>;
}
