import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const username = 'zackproser'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          color: '#00000',
          background: 'linear-gradient(to right, #99f2c8, #228B22)', // Gradient from light green to dark green
          width: '100%',
          height: '100%',
          paddingTop: 50,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
            color: '#f3f3f3'
          }}>zackproser.com</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
