import Link from 'next/link'

import { ContainerInner, ContainerOuter } from '@/components/Container'

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
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
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-col sm:flex-row gap-6 text-xl font-medium text-zinc-800 dark:text-zinc-200">
                <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                  <NavLink href="/blog">Blog</NavLink>
                  <NavLink href="/chat">Chat</NavLink>
                  <NavLink href="/videos">Videos</NavLink>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                  <NavLink href="/projects">Projects</NavLink>
                  <NavLink href="/newsletter">Newsletter</NavLink>
                  <NavLink href="/contact">Contact</NavLink>
                  <NavLink href="https://changelog.zackproser.com">Changelog</NavLink>
                </div>
              </div>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                &copy; {new Date().getFullYear()} Zachary Proser. All rights
                reserved.
              </p>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter >
    </footer >
  )
}
