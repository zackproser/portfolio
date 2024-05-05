import React from 'react';
import Link from 'next/link';

const SparkleNavItem = function({
  href,
  children,
  glowColor = '#FFD700' // Default gold color
}) {
  return (
    <li className="relative group" style={{ '--glow-color': glowColor }}>
      <Link href={href} className="block px-3 py-2 text-lg font-bold transition duration-300 ease-in-out transform group-hover:scale-105 glow">
        {children}
      </Link>
      <div className={`absolute top-0 right-0 sparkle ${glowColor === '#3fe291' ? 'sparkle-green' : 'sparkle-default'}`}></div>
    </li>
  );
};

export default SparkleNavItem;

