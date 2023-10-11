import Link from 'next/link'

import { Container } from '@/components/Container'

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="transition hover:text-teal-500 dark:hover:text-teal-400"
    >
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="mt-32">
      <Container.Outer>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <Container.Inner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-col sm:flex-row gap-6 text-xl font-medium text-zinc-800 dark:text-zinc-200">
                <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                  <NavLink className="mr-2 md:mr-0" href="/about">About</NavLink>
                  <NavLink className="mr-2 md:mr-0" href="/blog">Blog</NavLink>
                  <NavLink className="mr-2 md:mr-0" href="/videos">Videos</NavLink>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                  <NavLink className="mr-2 md:mr-0" href="/projects">Projects</NavLink>
                  <NavLink className="mr-2 md:mr-0" href="/testimonials">Testimonials</NavLink>
                  <NavLink className="mr-2 md:mr-0" href="/contact">Contact</NavLink>
                </div>
              </div>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                &copy; {new Date().getFullYear()} Zachary Proser. All rights
                reserved.
              </p>
            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  )
}


