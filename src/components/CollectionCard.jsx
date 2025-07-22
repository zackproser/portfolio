import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Import all possible collection images
const wakka = 'https://zackproser.b-cdn.net/images/wakka.webp'
const aiAssistDevTools = 'https://zackproser.b-cdn.net/images/ai-assisted-dev-tools.webp'
const sisyphusCrtMonitor = 'https://zackproser.b-cdn.net/images/sisyphus-crt-monitor-2.webp'
const codeiumVsChatgpt = 'https://zackproser.b-cdn.net/images/codeium-vs-chatgpt-review.webp'
const playingEq = 'https://zackproser.b-cdn.net/images/playing-eq.webp'
const teatutorLogo = 'https://zackproser.b-cdn.net/images/teatutor-logo.webp'
const joiningPinecone = 'https://zackproser.b-cdn.net/images/joining-pinecone.webp'
const neuralConnections = 'https://zackproser.b-cdn.net/images/you-get-to-keep-the-neural-connections.webp'
const automationsGif = 'https://zackproser.b-cdn.net/images/automations.gif'
const superHearingAid = 'https://zackproser.b-cdn.net/images/super-hearing-aid-safety-alert.webp'
const zacharyLight = 'https://zackproser.b-cdn.net/images/zachary-light.webp'
const nextjsDataDriven = 'https://zackproser.b-cdn.net/images/nextjs-data-driven-website.webp'
const ggshield = 'https://zackproser.b-cdn.net/images/ggshield-preventing-a-secret-from-escaping.webp'

// Map of collection slugs to imported images
const imageMap = {
  'ai': aiAssistDevTools,
  'rants': sisyphusCrtMonitor,
  'reviews': codeiumVsChatgpt,
  'comics': playingEq,
  'projects': teatutorLogo,
  'pinecone': joiningPinecone,
  'career': neuralConnections,
  'spectacular': automationsGif,
  'flights': superHearingAid,
  'personal': zacharyLight,
  'nextjs': nextjsDataDriven,
  'security': ggshield,
};

export function CollectionCard({ collection }) {
  if (!collection) {
    console.warn('CollectionCard received null or undefined collection')
    return null;
  }

  const { 
    title = 'Untitled', 
    description = '', 
    slug = '#',
  } = collection;

  // Get the collection key from the slug
  const collectionKey = slug.split('/').pop();
  
  // Get the image from the map or use default
  const imageSource = imageMap[collectionKey] || wakka;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg transition-all duration-300 bg-white dark:bg-gray-800 border relative w-full shadow-lg hover:shadow-xl border-gray-200 dark:border-gray-700">
      <Link href={slug} className="group w-full">
        <div className="relative w-full">
          <Image
            src={imageSource}
            alt={title}
            className="aspect-[16/9] w-full rounded-t-lg object-cover"
            width={500}
            height={281}
          />
          <div className="absolute inset-0 rounded-t-lg ring-1 ring-inset ring-gray-900/10 dark:ring-gray-700/50" />
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-300 ease-in-out tracking-tight text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-800 dark:text-gray-200 line-clamp-3 font-medium">
              {description}
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
} 