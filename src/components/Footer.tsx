import Link from 'next/link'

import { Container } from '@/components/Container'

const footerLinks = [
  {
    title: 'Connect',
    links: [
      { title: 'Contact', href: '/contact' },
      { title: 'Twitter', href: 'https://twitter.com/zackproser' },
      { title: 'LinkedIn', href: 'https://linkedin.com/in/zackproser' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { title: 'Technical Guides', href: '/tutorials' },
      { title: 'Dev Tools', href: '/devtools' },
      { title: 'API Reference', href: '/docs' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms', href: '/terms' }
    ]
  }
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
      <Container>
        <div className="py-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 md:grid-cols-4">
            {footerLinks.map((section) => (
              <div key={section.title} className="flex flex-col gap-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {section.title}
                </h3>
                <ul role="list" className="flex flex-col gap-4">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-center text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} Zachary Proser. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
