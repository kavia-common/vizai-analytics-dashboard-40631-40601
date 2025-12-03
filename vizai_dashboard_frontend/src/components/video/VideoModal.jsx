import React, { useEffect, useRef, useState } from 'react';
import Button from '../common/Button';

// PUBLIC_INTERFACE
export default function VideoModal({ open, onClose, event }) {
  const ref = useRef(null);
  const [error, setError] = useState(null);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    if (el) el.focus();
  }, [open]);

  if (!open) return null;

  const onError = () => setError('Playback error. Try downloading the clip.');
  const onSkip = (sec) => {
    const v = document.getElementById('video-player');
    if (v) v.currentTime = Math.max(0, v.currentTime + sec);
  };

  return (
    <div className="video-modal-backdrop" onClick={onClose} aria-modal="true" role="dialog" aria-label="Video modal">
      <div className="video-modal" onClick={(e) => e.stopPropagation()} tabIndex={-1} ref={ref}>
        <div className="video-modal-header">
          <strong>{event.behavior_type}</strong>
          <Button variant="ghost" onClick={onClose} aria-label="Close video modal">Close</Button>
        </div>
        <div className="video-modal-body">
          <div style={{ position: 'relative' }}>
            {error ? (
              <div className="card">
                <div className="small">{error}</div>
                <a className="btn" href={event.video_url} target="_blank" rel="noreferrer">Download clip</a>
              </div>
            ) : (
              <div className="video-player">
                <video id="video-player" src={event.video_url} controls width="100%" onError={onError} playbackRate={speed} />
                <svg className="video-overlay" viewBox="0 0 100 56" preserveAspectRatio="none">
                  <rect x="10" y="10" width="30" height="20" stroke="#F59E0B" fill="transparent" strokeWidth="1.5" />
                </svg>
              </div>
            )}
            <div className="form-row" style={{ marginTop: 8 }}>
              <Button variant="ghost" onClick={() => onSkip(-10)} aria-label="Skip back 10 seconds">-10s</Button>
              <Button variant="ghost" onClick={() => onSkip(10)} aria-label="Skip forward 10 seconds">+10s</Button>
              <select className="select" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} aria-label="Playback speed">
                {[0.5, 1, 1.5, 2].map(s => <option key={s} value={s}>{s}x</option>)}
              </select>
              <a className="btn ghost" href={`${window.location.origin}/timeline?id=${encodeURIComponent(event.id)}&start=${encodeURIComponent(event.start_timestamp)}`}>Share</a>
            </div>
          </div>
          <div>
            <div className="card" style={{ marginBottom: 8 }}>
              <div className="card-title">Metadata</div>
              <div className="small">Camera: {event.camera_source}</div>
              <div className="small">Time: {new Date(event.start_timestamp).toLocaleString()} - {new Date(event.end_timestamp).toLocaleString()}</div>
              <div className="small">Duration: {Math.round(event.duration_seconds)}s</div>
              <div className="small">Confidence: {Math.round(event.confidence_score * 100)}%</div>
            </div>
            <a className="btn" href={event.video_url} target="_blank" rel="noreferrer">Download</a>
          </div>
        </div>
      </div>
    </div>
  );
}
