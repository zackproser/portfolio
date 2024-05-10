import { FaSpinner } from 'react-icons/fa';

export const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center">
      <FaSpinner className="animate-spin text-blue-500 text-2xl mr-2" />
      <span className="text-lg">I&apos;m thinking...</span>
    </div>
  );
};
