import React from 'react';

// PUBLIC_INTERFACE
export default function Card({ title, action, children, style }) {
  return (
    <div className="card" style={style}>
      {title && (
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>{title}</div>
          <div>{action}</div>
        </div>
      )}
      {children}
    </div>
  );
}
