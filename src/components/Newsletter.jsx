import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { useRouter } from 'next/router'

function MailIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

export const Newsletter = function() {

  const [formSuccess, setSuccess] = React.useState(false);

  // Get access to the router in order to fetch query params off it
  const router = useRouter()

  const referrer = router.query.referrer || 'unknown/direct'

  const sendFormSubmissionEvent = () => {
    gtag('event', 'newsletter_subscribe', {
      "event_category": "subscription",
      "event_label": "newsletter",
    })
  }

  // Handle the submit event on form submit.
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    // Cast the event target to an html form
    const form = event.target

    // Get data from the form.
    const data = {
      email: form.email.value,
      referrer
    }

    // Send the form data to our API and get a response.
    await fetch('/api/form', {
      // Body of the request is the JSON data we created above.
      body: JSON.stringify(data),
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // The method is POST because we are sending data.
      method: 'POST',
    }).then(() => {
      // Send the GA4 event for newsletter subscription
      sendFormSubmissionEvent();
      // Update the form UI to show the user their subscription was successful
      setSuccess(true)
    }).catch((e) => {
      console.error(e)
    })
  }

  return (
    formSuccess
      ?
      <h2 className="flex mt-6 mb-6 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <span className="ml-3"> 🔥 You are awesome! 🔥 Thank you for subscribing 🥳 </span>
      </h2>

      :
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
      >

        <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <MailIcon className="h-6 w-6 flex-none" />
          <span className="ml-3">Supercharge your development skills</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          I publish deep-dive technical content for professional developers who want to become faster and more efficient in their work.
        </p>
        <div className="mt-6 flex">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            aria-label="Email address"
            required
            className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
          />
          <Button type="submit" className="ml-4 flex-none">
            Count me in
          </Button>
        </div>
      </form>
  )
}
