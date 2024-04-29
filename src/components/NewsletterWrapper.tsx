'use client'

import dynamic from 'next/dynamic';

const DynamicNewsletter = dynamic(() => import('./Newsletter'), { ssr: false });

const NewsletterWrapper = ({ title, body }: { title: string, body: string }) => {
  return <DynamicNewsletter title={title} body={body} />;
};

export default NewsletterWrapper;
