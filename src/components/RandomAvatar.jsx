import RandomImage from './RandomImage';

const imagePaths = [
  '/images/image1.jpg',
  '/images/image2.jpg',
  '/images/image3.jpg',
  // Add more image paths as needed
];

const ExamplePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Random Image</h1>
      <RandomImage imagePaths={imagePaths} />
    </div>
  );
};

export default ExamplePage;

