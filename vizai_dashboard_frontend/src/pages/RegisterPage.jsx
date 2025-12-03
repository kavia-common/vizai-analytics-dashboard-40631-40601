import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function RegisterPage() {
  /** Register card styled per register_design_notes.md */
  const navigate = useNavigate();
  const [email, setEmail] = useState('newuser@vizai.io');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Animal Keeper');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // mock validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Redirect to login after "register"
    navigate('/login');
  };

  return (
    <div className="auth-page" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-canvas)' }}>
      <div className="auth-card">
        <div className="logo">
          <span style={{ color: 'var(--brand-600)' }} aria-hidden="true">◆</span>
          <span style={{ color: 'var(--brand-600)', fontWeight: 700, fontSize: 18 }}>VizAI</span>
        </div>
        <h1 style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 700, textAlign: 'center', color: 'var(--text-primary)' }}>Create your VizAI account</h1>
        <div className="subtitle" style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center' }}>
          Your role determines navigation and permissions.
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="label" htmlFor="reg-email">Email</label>
            <input id="reg-email" className="input" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="reg-pass">Password</label>
            <input id="reg-pass" className="input" type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="reg-role">Role</label>
            <select id="reg-role" className="select" value={role} onChange={(e)=>setRole(e.target.value)}>
              <option>Animal Keeper</option>
              <option>Veterinarian</option>
              <option>Operations</option>
            </select>
          </div>

          {error && <div className="badge error" role="alert">{error}</div>}

          <button type="submit" className="primary-btn">Register</button>
        </form>

        <div className="auth-footer" style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
