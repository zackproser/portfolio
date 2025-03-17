'use client'

import dynamic from 'next/dynamic';

const DynamicNewsletter = dynamic(() => import('./Newsletter'), { ssr: false });

const NewsletterWrapper = ({ title, body, successMessage }: { title: string, body: string, successMessage?: string }) => {
  return <DynamicNewsletter title={title} body={body} successMessage={successMessage} />;
};

export default NewsletterWrapper;
