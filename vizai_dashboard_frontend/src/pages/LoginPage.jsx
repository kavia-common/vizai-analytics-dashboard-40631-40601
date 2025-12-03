import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn as authSignIn } from '../services/authService';
import { useApp } from '../context/AppContext';

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login card styled per login_design_notes.md */
  const [email, setEmail] = useState('demo@vizai.io');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useApp();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await authSignIn(email, password);
      await signIn(email, res.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-canvas)' }}>
      <div className="auth-card">
        <div className="logo">
          <span style={{ color: 'var(--brand-600)' }} aria-hidden="true">◆</span>
          <span style={{ color: 'var(--brand-600)', fontWeight: 700, fontSize: 18 }}>VizAI</span>
        </div>
        <h1 style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 700, textAlign: 'center', color: 'var(--text-primary)' }}>Sign in to VizAI</h1>
        <div className="subtitle" style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center' }}>
          Your role determines the dashboard view and available features.
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="label" htmlFor="login-email">Email</label>
            <input id="login-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="login-password">Password</label>
            <input id="login-password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="badge error" role="alert">{error}</div>}
          <button type="submit" className="primary-btn" disabled={busy}>{busy ? 'Signing in...' : 'Login'}</button>
          <div className="small">Use any password except "fail".</div>
        </form>

        <div className="auth-footer" style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          New to VizAI? <Link to="/register" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
}
