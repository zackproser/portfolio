import React from 'react';
import Link from 'next/link';

const variants = {
  none: '',
  green: 'whitespace-nowrap px-4 py-2 text-sm md:text-base bg-green-500 text-white rounded-full shadow-md'
}

const greenGlow = '#3fe291'

const SparkleNavItem = function({
  href,
  children,
  variant = 'none',
  glowColor = '#FFD700' // Default gold color
}) {
  return (
    <li className="relative group" style={{ '--glow-color': variant === 'green' ?  greenGlow : glowColor }}>
      <Link href={href} className={variant === 'green' ? variants.green : "block px-3 py-2 text-lg font-bold transition duration-300 ease-in-out transform group-hover:scale-105 glow"}>
        {children}
      </Link>
      <div className={`absolute top-0 right-0 ${variant === 'green' ? 'sparkle-green' : 'sparkle'}`}></div>
    </li>
  );
};

export default SparkleNavItem;

