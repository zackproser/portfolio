'use client'

import Link from 'next/link'
import { useState } from 'react'
import RandomImage from './RandomImage'
import { Button } from '@/components/Button'
import { track } from "@vercel/analytics"

function MailIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="#21fc0d"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-green-100 stroke-green-400 dark:fill-green-100/10 dark:stroke-green-500"
      />
      <path
        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
        className="stroke-green-400 dark:stroke-green-500"
      />
    </svg>
  )
}

const ToolComparisonIntro = ({ tool1, tool2 }) => {
  const [formSuccess, setSuccess] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.target
    const data = {
      email: form.email.value,
      referrer: window.location.pathname,
    }

    try {
      await fetch("/api/form", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
      track("newsletter-signup", { method: "newsletter" })
      setSuccess(true)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8 rounded-3xl shadow-2xl mb-12">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-2/3 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold text-white mb-4">AI Developer Tooling Expert</h1>
          <p className="text-xl text-white mb-6">
            I'm Zachary Proser, a full-stack developer specializing in AI-assisted developer tools. 
            With extensive experience in evaluating and implementing cutting-edge AI solutions, 
            I help teams optimize their development processes and boost productivity.
          </p>
        </div>
        <div className="md:w-1/3">
          <RandomImage />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
        <a
          href="https://calendly.com/your-calendly-link"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-purple-600 hover:bg-purple-100 font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          Book a Chat
        </a>
        <Link
          href={`/devtools/compare?tools=${encodeURIComponent(tool1)},${encodeURIComponent(tool2)}`}
          className="bg-yellow-400 text-purple-800 hover:bg-yellow-300 font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          Compare {tool1} and {tool2}
        </Link>
        <Link
          href="/contact"
          className="bg-green-500 text-white hover:bg-green-400 font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          Ask a Question
        </Link>
      </div>
      <div className="mt-8">
        {formSuccess ? (
          <h2 className="flex mt-6 mb-6 text-sm font-semibold text-white">
            <span className="ml-3">
              🔥 You are awesome! 🔥 Thank you for subscribing 🥳
            </span>
          </h2>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
              <MailIcon className="h-6 w-6 flex-none mr-3" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                aria-label="Email address"
                required
                className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
              />
            </div>
            <Button variant="green" type="submit" className="flex-none">
              Count me in
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ToolComparisonIntro