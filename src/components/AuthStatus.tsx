'use client'

import { useSession, signOut, signIn } from 'next-auth/react'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { UsersIcon } from './icons'

export function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return null
  }

  if (status === 'unauthenticated') {
    return (
      <Button 
        variant="outline" 
        onClick={() => signIn()}
        className="text-sm font-medium bg-blue-800 text-white border-blue-700 hover:bg-blue-700 hover:text-yellow-300 transition-colors"
      >
        Sign in
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full overflow-hidden">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <UsersIcon className="h-5 w-5 text-white" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800">
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium text-gray-900 dark:text-white">Signed in as</div>
          <div className="text-gray-500 dark:text-gray-400">{session?.user?.email}</div>
          {session?.user?.provider && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              via {session.user.provider}
            </div>
          )}
        </div>
        <DropdownMenuItem asChild>
          <Button 
            variant="ghost" 
            onClick={() => signOut()}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            Sign out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 