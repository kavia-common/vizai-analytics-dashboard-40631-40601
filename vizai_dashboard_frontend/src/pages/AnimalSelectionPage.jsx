import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// PUBLIC_INTERFACE
export default function AnimalSelectionPage() {
  const { api, setAnimal } = useApp();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api.getAnimalProfile().then(p => { if (active) { setProfile(p); setLoading(false); }});
    return () => { active = false; };
  }, [api]);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="content-card">
      <h2 style={{ marginTop: 0 }}>Select Animal</h2>
      <Card>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <img src={profile.photo_url} width="240" height="135" alt="Giant Anteater" style={{ borderRadius: 8, objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>{profile.name}</h3>
            <div className="small">{profile.species}</div>
            <div style={{ marginTop: 8 }}>
              <Badge tone={profile.status === 'Normal' ? 'success' : profile.status === 'Alert' ? 'error' : 'info'}>Status: {profile.status}</Badge>
            </div>
            <div className="small" style={{ marginTop: 6 }}>Last update: {new Date(profile.last_updated).toLocaleString()}</div>
          </div>
          <Button onClick={() => { setAnimal(profile); navigate('/dashboard'); }}>View Dashboard</Button>
        </div>
      </Card>
    </div>
  );
}
