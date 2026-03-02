import React from 'react';
import Link from 'next/link';

const UpdatedReviewBanner = ({ href, text, emoji = "📝" }) => {
  return (
    <div className="mb-8 rounded-xl border bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-white/10 p-4 md:p-5">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <div className="font-semibold mb-1">Updated Review Available</div>
          <div className="leading-relaxed">
            <Link href={href} className="text-white hover:text-blue-100 underline underline-offset-2">
              {text} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatedReviewBanner;