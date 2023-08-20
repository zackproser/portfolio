import Link from 'next/link'

import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  TwitchIcon,
  YouTubeIcon,
} from '@/components/SocialIcons'


const FollowButtons = () => (
  <div className="mt-5 p-2">
    <h2 className="text-2xl font-bold text-slate-500">Don&apos;t miss my next post!</h2>
    <div className="flex flex-wrap py-4">
      <Link href="https://www.twitch.tv/zackproser" target="_blank" rel="noreferrer" className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-2 py-2 rounded m-2 md:m-1">
        <TwitchIcon className="w-6 h-6" />&nbsp;
        zackproser
      </Link>
      <Link href="https://youtube.com/@zackproser" target="_blank" rel="noreferrer" className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-2 py-2 rounded m-2 md:m-1">
        <YouTubeIcon className="w-6 h-6" />&nbsp;
        zackproser
      </Link>
      <Link href="https://youtube.com/@pinecone-io" target="_blank" rel="noreferrer" className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-2 py-2 rounded m-2 md:m-1">
        <YouTubeIcon className="w-6 h-6" />&nbsp;
        pinecone-io
      </Link>
      <Link href="https://github.com/zackproser" target="_blank" rel="noreferrer" className="flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white px-2 py-2 rounded m-2 md:m-1">
        <GitHubIcon className="w-6 h-6" />&nbsp;
        zackproser
      </Link>
      <Link href="https://twitter.com/zackproser" target="_blank" rel="noreferrer" className="flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white px-2 py-2 rounded m-2 md:m-1">
        <TwitterIcon className="w-6 h-6" />&nbsp;
        zackproser
      </Link>
      <Link href="https://linkedin.com/in/zackproser" target="_blank" rel="noreferrer" className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded m-2 md:m-1">
        <LinkedInIcon className="w-6 h-6" />&nbsp;
        zackproser
      </Link>
      <Link href="https://instagram.com/zackproser" target="_blank" rel="noreferrer" className="flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded m-2 md:m-1">
        <InstagramIcon className="w-6 h-6" />&nbsp;
        zackproser
      </Link>
    </div>
  </div >
);


export default FollowButtons;

