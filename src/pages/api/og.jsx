import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  console.log(`og API route searchParams %o:`, searchParams)
  const hasTitle = searchParams.has('title');
  const title = hasTitle ? searchParams.get('title') : 'Staff Developer Advocate at Pinecone.io';
  const hasImage = searchParams.has('amp;image');
  const image = hasImage ? searchParams.get('amp;image') : undefined;

  console.log(`og API route hasImage: ${hasImage}, image: ${image}`)

  // My profile image is stored in /public so that we don't need to rely on an external host like GitHub 
  // that might go down
  const profileImageFetchURL = new URL('/public/zack.png', import.meta.url);

  const profileImageData = await fetch(profileImageFetchURL).then(
    (res) => res.arrayBuffer(),
  );

  // This is the URL to the image on my site 
  const ultimateURL = new URL(`${process.env.NEXT_PUBLIC_SITE_URL}${image}`)

  const postImageData = await fetch(ultimateURL).then(
    (res) => res.arrayBuffer(),
  ).catch((err) => {
    console.log(`og API route err: ${err}`);
  });

  return new ImageResponse(
    <div tw="flex flex-col w-full h-full bg-emerald-600">
      <div tw="flex flex-col md:flex-row w-full">
        <div tw="flex w-40 h-40 rounded-full overflow-hidden">
          <img
            src={profileImageData}
            alt="Zachary Proser"
            className="w-full h-full object-cover"
            style={{ borderRadius: 128 }}
          />
        </div>
        <div tw="flex flex-col ml-4 items-center">
          <h2 tw="text-4xl text-white">Zachary Proser</h2>
          <h2 tw="text-3xl text-white">Staff Developer Advocate @Pinecone.io</h2>
        </div>
      </div>
      <div tw="bg-slate-900 flex w-full">
        <div tw="flex flex-col md:flex-row w-full pt-8 px-4 md:items-center justify-between p-4">
          <h2 tw="flex flex-col pl-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
            <span tw="text-white">{title}</span>
          </h2>
          {hasImage && (
            <div tw="flex w-64 h-90 rounded overflow-hidden mt-4">
              <img
                src={postImageData}
                alt="Post Image"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
      <div tw="mt-1 flex items-center px-2 ml-2">
        <h3 tw="text-white text-4xl text-xl text-bold text-center">zackproser.com</h3>
      </div>
    </div>
  )
}
