import Image from 'next/image'
import Link from 'next/link'

export function VideoPostCard({ video }) {

  return (
    <article className="flex flex-col">
      <Link href={`/videos/${video.slug}`}>
        <Image
          src={video.image}
          alt={video.title}
          width={500}
          height={300}
        />
      </Link>

      <h3 className="mt-2 text-lg font-medium">
        <Link href={`/videos/${video.slug}`}>
          {video.title}
        </Link>
      </h3>

      <p className="text-sm text-gray-500">
        {video.description}
      </p>

    </article>
  )
}

