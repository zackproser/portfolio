import { generateOgUrl } from '@/utils/ogUrl'
import { RecruitersContent } from './RecruitersContent'

const data = {
  title: 'For recruiters',
  description:
    "How to reach Zack Proser productively about engineering roles. Current status, comp bar, what I'd consider, what I won't, and the brief format that gets a real reply.",
};

const ogUrl = generateOgUrl(data);

export const metadata = {
  title: data.title,
  description: data.description,
  // Stable URL but explicitly NOT discoverable — this page exists to be linked
  // from auto-replies to recruiter outreach, not surfaced in nav or search.
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://zackproser.com/recruiters' },
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

export default function RecruitersPage() {
  return <RecruitersContent />
}
