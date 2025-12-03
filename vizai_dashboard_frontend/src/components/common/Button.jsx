import React from 'react';
import clsx from 'clsx';

// PUBLIC_INTERFACE
export default function Button({ children, variant = 'primary', className, ...rest }) {
  return (
    <button className={clsx('btn', { secondary: variant === 'secondary', ghost: variant === 'ghost' }, className)} {...rest}>
      {children}
    </button>
  );
}
