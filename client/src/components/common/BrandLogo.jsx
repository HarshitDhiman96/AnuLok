import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo({ className = '', light = false, compact = false }) {
  const logoSrc = light ? '/anulok-logo-light.png' : '/anulok-logo-transparent.png';

  return (
    <Link
      to="/"
      aria-label="Anulok Home"
      className={`inline-flex shrink-0 items-center transition-transform hover:scale-102 group ${className}`}
    >
      <img
        src={logoSrc}
        alt="Anulok — Crafted Living"
        className={`block w-auto max-w-full object-contain ${
          compact ? 'h-9 sm:h-10' : 'h-11 sm:h-13 lg:h-14'
        }`}
      />
    </Link>
  );
}
