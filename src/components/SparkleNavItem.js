import React from 'react';
import Link from 'next/link';

const variants = {
  green: 'block px-3 py-2 text-lg text-emerald-600 dark:text-yellow-400 font-bold transition duration-300 ease-in-out transform group-hover:scale-105 green-glow dark:glow'
}

const greenGlow = '#3fe291'

const SparkleNavItem = function({
  href,
  children,
  variant,
  glowColor = '#FFD700' // Default gold color
}) {
  return (
    <li className="relative group" style={{ '--glow-color': variant === 'green' ? greenGlow : glowColor }}>
      <Link href={href} className={variant === 'green' ? variants.green : "block px-3 py-2 text-lg font-bold transition duration-300 ease-in-out transform group-hover:scale-105 glow"}>
        {children}
      </Link>
      <div className={`absolute top-0 right-0 ${variant === 'green' ? 'sparkle-green' : 'sparkle'}`}></div>
    </li>
  );
};

export default SparkleNavItem;

