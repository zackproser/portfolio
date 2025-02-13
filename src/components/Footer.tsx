import Link from 'next/link'

import { Container } from '@/components/Container'

const navigation = [
  {
    title: 'Getting started',
    links: [
      { title: 'Introduction', href: '/#introduction' },
      { title: 'Installation', href: '/#installation' },
      { title: 'Core concepts', href: '/#core-concepts' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'Documentation', href: '/docs' },
      { title: 'API Reference', href: '/api' },
      { title: 'Support', href: '/support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { title: 'Privacy', href: '/privacy' },
      { title: 'Terms', href: '/terms' },
      { title: 'License', href: '/license' },
    ],
  },
  {
    title: 'Social',
    links: [
      { title: 'Twitter', href: 'https://twitter.com/zacharyproser' },
      { title: 'GitHub', href: 'https://github.com/zacharyproser' },
      { title: 'LinkedIn', href: 'https://linkedin.com/in/zacharyproser' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container>
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 pt-16 pb-8 lg:grid-cols-2">
          <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <p className="text-base text-slate-500">
                &copy; {new Date().getFullYear()} Zachary Proser. All rights reserved.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
            {navigation.map((section) => (
              <div key={section.title} className="flex flex-col gap-6">
                <h3 className="text-sm font-semibold text-slate-900">
                  {section.title}
                </h3>
                <ul role="list" className="flex flex-col gap-4">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 hover:text-slate-900"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
