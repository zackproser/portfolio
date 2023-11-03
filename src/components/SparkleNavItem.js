import React from 'react';
import Link from 'next/link';

const SparkleNavItem = function({
  href,
  title,
  children
}) {
  return (
    <li className="relative group">
      <Link href={href}>
        <span className="block px-3 py-2 text-lg font-bold transition duration-300 ease-in-out transform group-hover:scale-105 glow">
          {children}
        </span>
      </Link>
      <div className="absolute top-0 right-0 sparkle"></div>
    </li>
  );
};

export default SparkleNavItem;

