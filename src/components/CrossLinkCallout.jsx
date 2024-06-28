import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

const CrossLinkCallout = ({ title, description, linkText, linkHref, variant = 'info' }) => {
  const variantStyles = {
    info: 'bg-blue-900 border-blue-700 text-blue-100',
    warning: 'bg-yellow-900 border-yellow-700 text-yellow-100',
    success: 'bg-green-900 border-green-700 text-green-100',
  };

  return (
    <div className={`p-4 my-6 rounded-lg border-2 shadow-md ${variantStyles[variant]}`}>
      <h3 className="text-lg text-white font-bold mb-2">{title}</h3>
      <p className="mb-3 text-base">{description}</p>
      <Link 
        href={linkHref} 
        className="inline-flex items-center text-sm font-semibold transition-colors duration-200 hover:underline"
      >
        {linkText}
        <ArrowRightIcon className="ml-2 w-4 h-4" />
      </Link>
    </div>
  );
};

export default CrossLinkCallout;
