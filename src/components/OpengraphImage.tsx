// Note: this isn't working properly yet, but it would make sense to use it instead of inlining all the JSX
// in the API route. It would also make the logic and styles for uniform image generation more portable

import React from 'react'

interface OpengraphImageProps {
  title: string
  description: string | null
  profileImageData: ArrayBuffer
  postImageData: ArrayBuffer
}

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  return Buffer.from(buffer).toString('base64')
}

const OpengraphImage: React.FC<OpengraphImageProps> = async ({
  title,
  description,
  profileImageData,
  postImageData
}) => {
  const base64ProfileImage = `data:image/png;base64,${arrayBufferToBase64(profileImageData)}`
  const base64PostImage = `data:image/png;base64,${arrayBufferToBase64(postImageData)}`

  return (
    <div
      tw="flex flex-col w-full h-full bg-emerald-900"
      style={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(45, 211, 12, 0.6), rgba(2, 91, 48, 0.4)), url(https://zackproser.com/alum.png)'
      }}
    >
      <div tw="flex flex-col md:flex-row w-full">
        <div tw="flex w-40 h-40 rounded-full overflow-hidden ml-29">
          <img
            src={base64ProfileImage}
            alt="Zachary Proser"
            className="w-full h-full object-cover"
            style={{ borderRadius: 128 }}
          />
        </div>
        <div tw="flex flex-col ml-4 items-center">
          <h1 tw="text-4xl text-white">Zachary Proser</h1>
          <h2 tw="text-3xl text-white">Staff Developer Advocate @Pinecone.io</h2>
        </div>
      </div>
      <div
        tw="bg-slate-900 bg-opacity-50 border-1 border-white flex w-full"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(31, 97, 141, 0.8), rgba(15, 23, 42, 0.8)), url(https://zackproser.com/subtle-stripes.png)'
        }}
      >
        <div tw="flex flex-col md:flex-row w-full pt-8 px-4 md:items-center justify-between p-4">
          <div tw="flex flex-col">
            <h2 tw="pl-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
              <span tw="text-white font-extrabold">{title}</span>
            </h2>
            {description && (
              <p
                tw="pl-2 text-1xl sm:text-2xl font-extrabold tracking-tight text-white text-left break-words"
                style={{ maxWidth: '600px' }}
              >
                {description}
              </p>
            )}
          </div>
          <div tw="flex w-64 h-85 rounded overflow-hidden mt-4">
            <img
              src={base64PostImage}
              alt="Post Image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div tw="flex flex-col items-center">
        <h1 tw="text-white text-3xl pb-2">zackproser.com</h1>
      </div>
    </div >
  )
}

export default OpengraphImage
