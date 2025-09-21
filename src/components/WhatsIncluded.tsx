import Image from 'next/image'

interface WhatsIncludedItem {
  title: string
  description: string
  image: string | { src: string }
  imageAlt?: string
}

interface WhatsIncludedProps {
  items: WhatsIncludedItem[]
  sectionTitle?: string
  sectionSubtitle?: string
}

export function WhatsIncluded({ 
  items, 
  sectionTitle = "What's Included",
  sectionSubtitle = "Everything you need to build production-ready solutions"
}: WhatsIncludedProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {sectionTitle}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            {sectionSubtitle}
          </p>
        </div>

        {/* Items */}
        <div className="mx-auto mt-16 max-w-7xl">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col gap-8 lg:gap-16 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center ${index > 0 ? 'mt-16 lg:mt-24' : ''}`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-8">
                  <Image
                    src={item.image}
                    alt={item.imageAlt || item.title}
                    className="h-auto w-full object-cover rounded-xl"
                    width={600}
                    height={400}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2">
                <div className="max-w-xl">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 