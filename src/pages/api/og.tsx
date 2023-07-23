import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// TODO - figure out the cleanest way of reading the image property from the post's MDX file
// TODO - style this ImageResponse using Tailwind
export default async function handler() {
  const imageData = await fetch(new URL('/src/images/joining-pinecone.png', import.meta.url)).then(
    (res) => res.arrayBuffer(),
  );


  return new ImageResponse(
    <div style={{ display: "flex" }} className="bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div style={{ display: "flex" }} className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Support center</h2>
        <img
          src={imageData as unknown as string}
          width={568}
          height={568}
          style={{ borderRadius: 128 }}
        />
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
          fugiat veniam occaecat fugiat aliqua.
        </p>
      </div>
    </div>
  )
}
