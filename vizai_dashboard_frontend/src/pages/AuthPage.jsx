import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { signIn as authSignIn } from '../services/authService';
import { useApp } from '../context/AppContext';

// PUBLIC_INTERFACE
export default function AuthPage() {
  const [email, setEmail] = useState('demo@vizai.io');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useApp();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await authSignIn(email, password);
      await signIn(email, res.token);
      navigate('/animals');
    } catch (err) {
      setError(err.message || 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Card title="Sign in to VizAI" style={{ width: 360 }}>
        {error && <div className="badge error" role="alert">{error}</div>}
        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gap: 10 }}>
            <label className="small">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label className="small">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign In'}</Button>
            <div className="small">Use any password except "fail".</div>
          </div>
        </form>
      </Card>
    </div>
  );
}
