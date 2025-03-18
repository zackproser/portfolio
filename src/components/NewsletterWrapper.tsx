'use client'

import dynamic from 'next/dynamic';

const DynamicNewsletter = dynamic(() => import('./Newsletter'), { ssr: false });

interface NewsletterWrapperProps {
  title: string;
  body: string;
  successMessage?: string;
  onSubscribe?: () => void;
}

const NewsletterWrapper = ({ 
  title, 
  body, 
  successMessage,
  onSubscribe 
}: NewsletterWrapperProps) => {
  return <DynamicNewsletter 
    title={title} 
    body={body} 
    successMessage={successMessage}
    onSubscribe={onSubscribe}
  />;
};

export default NewsletterWrapper;
