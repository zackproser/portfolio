'use client'

import React from 'react'
import { Suspense } from 'react'

const extractYoutubeId = (url) => {
  try {
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  } catch (error) {
    console.error('Error extracting YouTube ID:', error)
    return null
  }
}

// Function to create the embed URL with appropriate parameters
const getEmbedUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`
}

// Single video component with loading state
const YouTubeVideo = ({ url, title }) => {
  const videoId = extractYoutubeId(url)
  
  if (!videoId) return <div className="text-red-500">Invalid YouTube URL</div>
  
  const embedUrl = getEmbedUrl(videoId)
  
  return (
    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-3 border border-gray-200 shadow-sm">
      <iframe
        src={embedUrl}
        title={title || "YouTube video player"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="w-full h-full"
      ></iframe>
    </div>
  )
}

// Multiple videos or single video wrapper
const YoutubeEmbed = ({ urls, title }) => {
  if (!urls) return null
  
  // If urls is an array, render multiple videos
  if (Array.isArray(urls)) {
    return (
      <div className="space-y-4">
        {urls.map((url, index) => (
          <Suspense key={index} fallback={<VideoSkeleton />}>
            <YouTubeVideo url={url} title={`${title || 'Video'} ${index + 1}`} />
          </Suspense>
        ))}
      </div>
    )
  }
  
  // If urls is a single string, render a single video
  return (
    <Suspense fallback={<VideoSkeleton />}>
      <YouTubeVideo url={urls} title={title} />
    </Suspense>
  )
}

// Loading skeleton for videos
const VideoSkeleton = () => (
  <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden animate-pulse mb-3">
    <div className="flex items-center justify-center h-full">
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  </div>
)

export default YoutubeEmbed 