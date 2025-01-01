'use client'

import { React, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import SparkleNavItem from './SparkleNavItem'

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from './ui/navigation-menu';

import {
  FileTextIcon,
  VideoIcon,
  BoxIcon,
  UsersIcon,
  MenuIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon
} from './icons';

import { Container } from './Container';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from './ui/sheet';

import {
  Button
} from './ui/button';

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from './ui/collapsible';

import { ThemeToggleWrapper } from './ThemeToggleWrapper'
import { AuthStatus } from './AuthStatus'

const navHierarchy = [
  {
    label: 'My Work',
    children: [
      {
        label: 'Blog',
        href: '/blog',
        description: 'Read my latest articles and insights.',
        icon: FileTextIcon,
      },
      {
        label: 'Videos',
        href: '/videos',
        description: 'Watch my latest videos.',
        icon: VideoIcon,
      },
      {
        label: 'Projects',
        href: '/projects',
        description: 'Explore my work and projects.',
        icon: BoxIcon,
      },
      {
        label: 'Publications',
        href: '/publications',
        description: 'Published works',
        icon: FileTextIcon,
      },
      {
        label: 'Collections',
        href: '/collections',
        description: 'See my writing organized by theme',
        icon: FileTextIcon,
      },
      {
        label: 'Comparisons',
        href: '/comparisons',
        description: 'Compare various AI tools and technologies',
        icon: BoxIcon,
      }
    ],
  },
  {
    label: 'Accolades',
    children: [
      {
        label: 'Testimonials',
        href: '/testimonials',
        description: 'What is it like working with me?',
        icon: UsersIcon,
      },
    ],
  },
  {
    label: 'Interactive',
    children: [
      {
        label: 'Chat with my blog',
        href: '/chat',
        description: 'Custom RAG pipeline',
        icon: BoxIcon,
      },
      {
        label: 'Intro to tokenization',
        href: '/demos/tokenize',
        description: 'How do LLMs see text?',
        icon: BoxIcon,
      },
      {
        label: 'Intro to embeddings',
        href: '/demos/embeddings',
        description: 'Learn what vectors are',
        icon: BoxIcon,
      },
      {
        label: 'Vector Databases',
        href: '/vectordatabases',
        description: 'Discover vector databases',
        icon: BoxIcon,
      },
      {
        label: 'Vector DB comparison tool',
        href: '/vectordatabases/compare',
        description: 'Compare multiple vector databases',
        icon: BoxIcon,
      },
      {
        label: 'AI-enhanced developer tools',
        href: '/devtools',
        description: 'Discover and compare AI-powered tools for developers',
        icon: BoxIcon,
      },
      {
        label: 'AI devtool comparison tool',
        href: '/devtools/compare',
        description: 'Compare multiple AI-powered developer tools',
        icon: BoxIcon,
      },
   ],
  },
  {
    label: 'Contact',
    href: '/contact',
  },
  {
    label: 'Learn',
    href: '/learn',
    sparkle: true, // Added sparkle
  },
  {
    label: 'Hire me',
    href: 'https://sponsor.zackproser.com',
    sparkle: true, // Added sparkle
  },
];

const DesktopNav = ({ navItems }) => (
  <nav className="hidden items-center justify-center gap-6 md:flex">
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item) =>
          item.children ? (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuTrigger className="flex justify-center">
                <span className="font-medium">{item.label}</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-4 p-4">
                  {item.children.map((child) => (
                    child.sparkle ? (
                      <SparkleNavItem variant={'green'} key={child.label} href={child.href}>
                        <child.icon className="h-5 w-5 text-muted-foreground group-hover:text-accent-foreground" />
                        <div>
                          <div className="font-medium">{child.label}</div>
                          <p className="text-sm text-muted-foreground">{child.description}</p>
                        </div>
                      </SparkleNavItem>
                    ) : (
                      <NavigationMenuLink asChild key={child.label}>
                        <Link href={child.href} className="group flex items-center gap-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
                          <child.icon className="h-5 w-5 text-muted-foreground group-hover:text-accent-foreground" />
                          <div>
                            <div className="font-medium">{child.label}</div>
                            <p className="text-sm text-muted-foreground">{child.description}</p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    )
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            item.sparkle ? (
              <SparkleNavItem variant={'green'} key={item.label} href={item.href}>
                {item.label}
              </SparkleNavItem>
            ) : (
              <NavigationMenuLink asChild key={item.label}>
                <Link href={item.href} className="font-medium" prefetch={false}>
                  {item.label}
                </Link>
              </NavigationMenuLink>
            )
          )
        )}
        <NavigationMenuLink className="pl-10 ml-10">
          <ThemeToggleWrapper />
        </NavigationMenuLink>
        <NavigationMenuLink className="pl-2">
          <AuthStatus />
        </NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  </nav>
);

const MobileNav = ({ navItems }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="md:hidden">
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold" prefetch={false}>
            <span>Zack Proser</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggleWrapper />
            <AuthStatus />
          </div>
        </div>
        <nav className="grid gap-2">
          {navItems.map((item) =>
            item.children ? (
              <Collapsible key={item.label}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  {item.label}
                  <ChevronRightIcon className="h-5 w-5 transition-transform group-[data-state=open]:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent className="grid gap-2 pl-4">
                  {item.children.map((child) => (
                    child.sparkle ? (
                      <SparkleNavItem key={child.label} href={child.href}>
                        {child.label}
                      </SparkleNavItem>
                    ) : (
                      <Link key={child.label} href={child.href} className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground" prefetch={false}>
                        {child.label}
                      </Link>
                    )
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              item.sparkle ? (
                <SparkleNavItem variant={"green"} key={item.label} href={item.href}>
                  {item.label}
                </SparkleNavItem>
              ) : (
                <Link key={item.label} href={item.href} className="rounded-md px-3 py-2 font-medium hover:bg-accent hover:text-accent-foreground" prefetch={false}>
                  {item.label}
                </Link>
              )
            )
          )}
          <ThemeToggleWrapper />
        </nav>
      </div>
    </SheetContent>
  </Sheet>
);

export const Nav = ({ navItems }) => (
  <Container>
    <header className="bg-background text-foreground relative z-50 flex flex-none flex-col" style={{ height: 'var(--header-height)', marginBottom: 'var(--header-mb)' }}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold" prefetch={false}>
          <span>Zack Proser</span>
        </Link>
        <DesktopNav navItems={navItems} />
        <MobileNav navItems={navItems} />
      </div>
    </header>
  </Container>
);

export const Navigation = () => {
  return <Nav navItems={navHierarchy} />
};

