import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const username = 'zackproser'
  const hasTitle = searchParams.has('title');
  const title = hasTitle ? searchParams.get('title') : 'Staff Developer Advocate at Pinecone.io'

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
          width="256"
          height="256"
          src={`https://github.com/${username}.png`}
          style={{
            borderRadius: 128,
          }}
        />
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
