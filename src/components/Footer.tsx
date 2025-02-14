import Link from 'next/link'

import { Container } from '@/components/Container'

const navigation = [
  {
    title: 'Social',
    links: [
      { title: 'Twitter', href: 'https://twitter.com/zackproser' },
      { title: 'GitHub', href: 'https://github.com/zackproser' },
      { title: 'LinkedIn', href: 'https://linkedin.com/in/zackproser' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container>
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
      </Container>
    </footer>
  )
}
