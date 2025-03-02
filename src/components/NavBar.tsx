'use client'

import { useEffect, useRef, useState } from 'react'
import { Popover } from '@headlessui/react'
import clsx from 'clsx'

const sections = [
  {
    id: 'table-of-contents',
    title: (
      <>
        <span className="hidden lg:inline">Table of contents</span>
        <span className="lg:hidden">Contents</span>
      </>
    ),
  },
  { id: 'resources', title: 'Resources' },
  { id: 'pricing', title: 'Pricing' },
  { id: 'author', title: 'Author' },
]

function MenuIcon({
  open,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  open: boolean
}) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d={open ? 'M17 7 7 17M7 7l10 10' : 'm15 16-3 3-3-3M15 8l-3-3-3 3'}
      />
    </svg>
  )
}

export function NavBar() {
  let navBarRef = useRef<React.ElementRef<'div'>>(null)
  let [activeIndex, setActiveIndex] = useState<number | null>(null)
  let mobileActiveIndex = activeIndex === null ? 0 : activeIndex

  useEffect(() => {
    function updateActiveIndex() {
      if (!navBarRef.current) {
        return
      }

      let newActiveIndex = null
      let elements = sections.map(({ id }) => document.getElementById(id))
      let bodyRect = document.body.getBoundingClientRect()
      let offset = bodyRect.top + navBarRef.current.offsetHeight + 1

      if (window.scrollY >= Math.floor(bodyRect.height) - window.innerHeight) {
        setActiveIndex(sections.length - 1)
        return
      }

      for (let index = 0; index < elements.length; index++) {
        let element = elements[index]
        if (!element) {
          continue
        }

        let rect = element.getBoundingClientRect()
        if (window.scrollY >= rect.top - offset) {
          newActiveIndex = index
        } else {
          break
        }
      }

      setActiveIndex(newActiveIndex)
    }

    updateActiveIndex()

    window.addEventListener('resize', updateActiveIndex)
    window.addEventListener('scroll', updateActiveIndex, { passive: true })

    return () => {
      window.removeEventListener('resize', updateActiveIndex)
      window.removeEventListener('scroll', updateActiveIndex)
    }
  }, [])

  return (
    <div ref={navBarRef} className="sticky top-0 z-50">
      <Popover className="sm:hidden">
        {({ open }) => (
          <>
            <div
              className={clsx(
                'relative flex items-center px-4 py-3',
                !open &&
                  'bg-white/95 shadow-sm [@supports(backdrop-filter:blur(0))]:bg-white/80 [@supports(backdrop-filter:blur(0))]:backdrop-blur dark:bg-slate-900/95 dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/80',
              )}
            >
              {!open && (
                <>
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm text-blue-600 dark:text-blue-400"
                  >
                    {(mobileActiveIndex + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="ml-4 text-base font-medium text-slate-900 dark:text-white">
                    {sections[mobileActiveIndex].title}
                  </span>
                </>
              )}
              <Popover.Button
                className={clsx(
                  '-mr-1 ml-auto flex h-8 w-8 items-center justify-center',
                  open && 'relative z-10',
                )}
                aria-label="Toggle navigation menu"
              >
                <MenuIcon open={open} className="h-6 w-6 stroke-slate-700 dark:stroke-slate-300" />
              </Popover.Button>
            </div>
            <Popover.Panel className="absolute inset-x-0 top-0 bg-white/95 py-3.5 shadow-sm [@supports(backdrop-filter:blur(0))]:bg-white/80 [@supports(backdrop-filter:blur(0))]:backdrop-blur-sm dark:bg-slate-900/95 dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/80">
              {sections.map((section, sectionIndex) => (
                <Popover.Button
                  as="a"
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center px-4 py-1.5"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm text-blue-600 dark:text-blue-400"
                  >
                    {(sectionIndex + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="ml-4 text-base font-medium text-slate-900 dark:text-white">
                    {section.title}
                  </span>
                </Popover.Button>
              ))}
            </Popover.Panel>
            <div className="absolute inset-x-0 bottom-full z-10 h-4 bg-white dark:bg-slate-900" />
          </>
        )}
      </Popover>
      <div className="hidden sm:flex sm:h-32 sm:justify-center sm:border-b sm:border-slate-200 sm:bg-white/95 sm:[@supports(backdrop-filter:blur(0))]:bg-white/80 sm:[@supports(backdrop-filter:blur(0))]:backdrop-blur-sm dark:sm:bg-slate-900/95 dark:sm:border-slate-800 dark:sm:[@supports(backdrop-filter:blur(0))]:bg-slate-900/80">
        <ol
          role="list"
          className="mb-[-2px] grid auto-cols-[minmax(0,15rem)] grid-flow-col text-base font-medium text-slate-900 dark:text-white [counter-reset:section]"
        >
          {sections.map((section, sectionIndex) => (
            <li key={section.id} className="flex [counter-increment:section]">
              <a
                href={`#${section.id}`}
                className={clsx(
                  'flex w-full flex-col items-center justify-center border-b-2 bg-transparent py-5 after:mt-2 after:font-mono after:text-sm after:content-[counter(section,decimal-leading-zero)]',
                  sectionIndex === activeIndex
                    ? 'border-blue-600 text-blue-600 after:text-blue-600 dark:border-blue-400 dark:text-blue-400 dark:after:text-blue-400'
                    : 'border-transparent after:text-slate-500 hover:bg-blue-50/40 hover:after:text-slate-900 dark:after:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:after:text-slate-300'
                )}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
} 