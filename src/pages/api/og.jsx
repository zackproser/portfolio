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

  const profileImageFetchURL = new URL('/public/zack.png', import.meta.url);

  console.log(`og API route profileImageFetchURL: ${profileImageFetchURL}`)

  const profileImageData = await fetch(profileImageFetchURL).then(
    (res) => res.arrayBuffer(),
  );

  const fetchURL = () => {
    setTimeout(() => {
      return new URL(image, import.meta.url);
    }, 300)
  }

  console.log(`og API route fetchURL: ${fetchURL}`)

  const postImageData = await fetch(new URL(fetchURL, import.meta.url)).then(
    (res) => res.arrayBuffer(),
  ).catch((err) => {
    console.log(`og API route err: ${err}`);
  });

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 50,
          color: '#00000',
          background: 'linear-gradient(to right, #99f2c8, #228B22)', // Gradient from light green to dark green
          width: '100%',
          height: '100%',
          paddingTop: 15,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            color: '#00000'
          }}>Zachary Proser</p>
        <img
          width="156"
          height="156"
          src={profileImageData}
          style={{
            borderRadius: 128,
          }}
        />
        {hasImage &&
          <img
            width="56"
            height="56"
            src={postImageData}
            style={{
              borderRadius: 128,
            }}
          />
        }
        <p
          style={{
            color: '#00000',
            paddingTop: 10,
            paddingBottom: 15,
            textAlign: 'center',
          }}
        >{title}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
