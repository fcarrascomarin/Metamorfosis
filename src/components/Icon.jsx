import React from 'react';

export default function Icon({ name, className = '', title }) {
  return (
    <span className={`material-symbols-rounded ${className}`} aria-hidden={title ? undefined : 'true'} title={title}>
      {name}
    </span>
  );
}
