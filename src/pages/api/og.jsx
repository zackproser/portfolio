import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  console.log(`og API route searchParams %o:`, searchParams)
  const hasTitle = searchParams.has('title');
  const title = hasTitle ? searchParams.get('title') : 'Portfolio, blog, videos and open-source projects';
  // This is horrific - need to figure out and fix this 
  const hasImage = searchParams.has('image') || searchParams.get('amp;image')
  // This is equally horrific - need to figure out and fix this for good
  const image = hasImage ? (searchParams.get('image') || searchParams.get('amp;image')) : undefined;

  console.log(`og API route hasImage: ${hasImage}, image: ${image}`)

  const hasDescription = searchParams.has('description') || searchParams.get('amp;description')
  const description = hasDescription ? searchParams.get('description') || searchParams.get('amp;description') : undefined

  // My profile image is stored in /public so that we don't need to rely on an external host like GitHub 
  // that might go down
  const profileImageFetchURL = new URL('/public/zack.png', import.meta.url);

  const profileImageData = await fetch(profileImageFetchURL).then(
    (res) => res.arrayBuffer(),
  );

  // This is the fallback image I use if the current post doesn't have an image for whatever reason (like it's the homepage)
  const fallBackImageURL = new URL('/public/zack-proser-dev-advocate.png', import.meta.url);

  // This is the URL to the image on my site 
  const ultimateURL = hasImage ? new URL(`${process.env.NEXT_PUBLIC_SITE_URL}${image} `) : fallBackImageURL

  const postImageData = await fetch(ultimateURL).then(
    (res) => res.arrayBuffer(),
  ).catch((err) => {
    console.log(`og API route err: ${err} `);
  });

  return new ImageResponse(
    <div
      tw="flex flex-col w-full h-full bg-emerald-900"
      style={{
        background_image: 'linear-gradient(to bottom, rgba(45, 211, 12, 0.6), rgba(2, 91, 48, 0.4)), url(https://zackproser.com/alum.png)'
      }}
    >
      <div tw="flex flex-col md:flex-row w-full">
        <div tw="flex w-40 h-40 rounded-full overflow-hidden ml-29">
          <img
            src={profileImageData}
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
          background_image: `linear-gradient(to right, rgba(31, 97, 141, 0.8), rgba(15, 23, 42, 0.8)), url(https://zackproser.com/subtle-stripes.png)`
        }}
      >
        <div tw="flex flex-col md:flex-row w-full pt-8 px-4 md:items-center justify-between p-4">
          <div tw="flex flex-col">  {/* New flex column container */}
            <h2 tw="pl-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
              <span tw="text-white font-extrabold">{title}</span>
            </h2>
            {hasDescription && (
              <p tw="pl-2 text-1xl sm:text-2xl font-extrabold tracking-tight text-white text-left break-words"
                style={{ maxWidth: '600px' }}
              >{description}</p>
            )}
          </div>
          <div tw="flex w-64 h-85 rounded overflow-hidden mt-4">
            <img
              src={postImageData}
              alt="Post Image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div tw="flex flex-col items-center">
        <h1
          tw="text-white text-3xl pb-2"
        >
          zackproser.com
        </h1>
      </div>
    </div>
  )
}
