'use client'

import { useSession, signOut, signIn } from 'next-auth/react'
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
        variant="ghost" 
        onClick={() => signIn()}
        className="text-sm font-medium"
      >
        Sign in
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <UsersIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium">Signed in as</div>
          <div className="text-muted-foreground">{session?.user?.email}</div>
        </div>
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={() => signOut()}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 