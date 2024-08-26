'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { track } from '@vercel/analytics';

import one from '@/images/avatars/1.webp'
import two from '@/images/avatars/2.webp'
import three from '@/images/avatars/3.webp'
import four from '@/images/avatars/4.webp'
import five from '@/images/avatars/5.webp'
import six from '@/images/avatars/6.webp'
import seven from '@/images/avatars/7.webp'
import eight from '@/images/avatars/8.webp'
import nine from '@/images/avatars/9.webp'
import ten from '@/images/avatars/10.webp'
import eleven from '@/images/avatars/11.webp'
import twelve from '@/images/avatars/12.webp'
import thirteen from '@/images/avatars/13.webp'
import fourteen from '@/images/avatars/14.webp'
import fifteen from '@/images/avatars/15.webp'
import sixteen from '@/images/avatars/16.webp'


const imagePaths = [
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
  eleven,
  twelve,
  thirteen,
  fourteen,
  fifteen,
  sixteen
];

const RandomPortrait = ({ width, height }) => {
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    setRandomPortrait();
  }, []);

  const setRandomPortrait = () => {
    track("random-image-avatar-click")
    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    setSelectedImage(imagePaths[randomIndex]);
  };

  if (!selectedImage) return null;

  const imageProps = width && height
    ? { width, height }
    : { fill: true, sizes: "(min-width: 1024px) 32rem, 20rem" };

  return (
    <div
      className={`relative ${width && height ? '' : 'w-full aspect-square'} mb-4 pb-4`}
      onMouseOver={setRandomPortrait}
      onClick={setRandomPortrait}
      style={{ cursor: 'pointer' }}>
      <Image
        src={selectedImage}
        alt="Zachary Proser - full stack developer"
        {...imageProps}
        className={`${width && height ? '' : 'object-cover'} rounded-2xl bg-zinc-100 dark:bg-zinc-800`}
      />
    </div>
  );
};

export default RandomPortrait;