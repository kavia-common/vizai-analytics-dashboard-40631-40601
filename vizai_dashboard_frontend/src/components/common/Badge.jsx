import React from 'react';
import clsx from 'clsx';

// PUBLIC_INTERFACE
export default function Badge({ children, tone = 'info', className }) {
  return <span className={clsx('badge', tone, className)}>{children}</span>;
}
