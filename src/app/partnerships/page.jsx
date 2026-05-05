import { generateOgUrl } from '@/utils/ogUrl'
import { PartnershipsContent } from './PartnershipsContent'

const data = {
  title: 'Partnerships',
  description:
    'How brands work with Modern Coding / zackproser.com. Sponsored articles, newsletter sends, affiliates, workshops, retainers — pricing, editorial standards, and intake.',
};

const ogUrl = generateOgUrl(data);

export const metadata = {
  title: data.title,
  description: data.description,
  alternates: { canonical: 'https://zackproser.com/partnerships' },
  openGraph: {
    title: data.title,
    description: data.description,
    url: ogUrl,
    siteName: 'Modern Coding',
    images: [{ url: ogUrl }],
    locale: 'en_US',
    type: 'website',
  },
};

export default function PartnershipsPage() {
  return <PartnershipsContent />
}
