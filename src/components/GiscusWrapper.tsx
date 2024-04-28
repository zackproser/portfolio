import dynamic from 'next/dynamic';

const DynamicGiscus = dynamic(() => import('./Giscus'), { ssr: false });

const GiscusWrapper = () => {
  return <DynamicGiscus />;
};

export default GiscusWrapper;
