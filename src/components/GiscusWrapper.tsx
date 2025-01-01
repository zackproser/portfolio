import dynamic from 'next/dynamic';

const DynamicGiscus = dynamic(() => import('./Giscus'));

const GiscusWrapper = () => {
  return <DynamicGiscus />;
};

export default GiscusWrapper;
