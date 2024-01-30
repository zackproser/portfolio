'use client'

import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import githubSignin from '@/images/github-signin.png'

export default function Component () {
  const handleClick = (e) => {
    e.preventDefault()
    signIn()
  }

  return (
                    <Link onClick={handleClick} href="/learn" passHref>
                              <Image width={1200} src={githubSignin} alt="Github Signin" />
                    </Link>
  )
}
