'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';

import one from '@/images/avatars/1.webp'
import two from '@/images/avatars/2.webp'

const imagePaths = [
  one, two
];

const RandomImage = () => {
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    setRandomImage();
  }, []);

  const setRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    setSelectedImage(imagePaths[randomIndex]);
  };

  if (!selectedImage) return null;

  return (
    <div className="relative w-full h-full" onClick={setRandomImage} style={{ cursor: 'pointer' }}>
      <Image
        src={selectedImage}
        alt="Randomly selected"
        layout="fill"
        objectFit="cover"
        className="rounded-lg shadow-lg"
      />
    </div>
  );
};

export default RandomImage;

