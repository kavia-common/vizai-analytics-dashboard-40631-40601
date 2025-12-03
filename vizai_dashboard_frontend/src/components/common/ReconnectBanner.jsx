import React, { useEffect, useState } from 'react';
import { getEnv } from '../../utils/env';

// PUBLIC_INTERFACE
export default function ReconnectBanner() {
  const { wsUrl } = getEnv();
  const [show, setShow] = useState(!wsUrl);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    if (!wsUrl) return;
    setShow(false);
  }, [wsUrl]);

  const tryReconnect = () => {
    setReconnecting(true);
    setTimeout(() => {
      // simulate reconnect success
      setReconnecting(false);
      setShow(false);
    }, 900);
  };

  if (!show) return null;
  return (
    <div className="reconnect-banner" role="status" aria-live="polite">
      Real-time connection unavailable. <button className="btn ghost" onClick={tryReconnect} disabled={reconnecting} style={{ marginLeft: 8 }}>
        {reconnecting ? 'Reconnecting...' : 'Retry'}
      </button>
    </div>
  );
}
