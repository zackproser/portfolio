'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { track } from '@vercel/analytics';

const one = 'https://zackproser.b-cdn.net/images/avatars/1.webp'
const two = 'https://zackproser.b-cdn.net/images/avatars/2.webp'
const three = 'https://zackproser.b-cdn.net/images/avatars/3.webp'
const four = 'https://zackproser.b-cdn.net/images/avatars/4.webp'
const five = 'https://zackproser.b-cdn.net/images/avatars/5.webp'
const six = 'https://zackproser.b-cdn.net/images/avatars/6.webp'
const seven = 'https://zackproser.b-cdn.net/images/avatars/7.webp'
const eight = 'https://zackproser.b-cdn.net/images/avatars/8.webp'
const nine = 'https://zackproser.b-cdn.net/images/avatars/9.webp'
const ten = 'https://zackproser.b-cdn.net/images/avatars/10.webp'
const eleven = 'https://zackproser.b-cdn.net/images/avatars/11.webp'
const twelve = 'https://zackproser.b-cdn.net/images/avatars/12.webp'
const thirteen = 'https://zackproser.b-cdn.net/images/avatars/13.webp'
const fourteen = 'https://zackproser.b-cdn.net/images/avatars/14.webp'
const fifteen = 'https://zackproser.b-cdn.net/images/avatars/15.webp'
const sixteen = 'https://zackproser.b-cdn.net/images/avatars/16.webp'


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
  const [selectedImage, setSelectedImage] = useState(imagePaths[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    setSelectedImage(imagePaths[randomIndex]);
  }, []);

  const setRandomPortrait = () => {
    track("random-image-avatar-click")
    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    setSelectedImage(imagePaths[randomIndex]);
  };

  const imageProps = width && height
    ? { width, height }
    : { fill: true, sizes: "(min-width: 1024px) 32rem, 20rem" };

  return (
    <div
      className={`relative ${width && height ? '' : 'w-full aspect-square'} mb-4 pb-4`}
      onMouseOver={setRandomPortrait}
      onClick={setRandomPortrait}
      style={{ cursor: 'pointer' }}>
      <Image src={selectedImage}
        alt="Zachary Proser - full stack developer"
        {...imageProps}
        className={`${width && height ? '' : 'object-cover'} rounded-2xl bg-zinc-100 dark:bg-zinc-800`} />
    </div>
  );
};

export default RandomPortrait;