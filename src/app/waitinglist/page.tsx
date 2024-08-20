import { Metadata } from 'next'
import { createMetadata } from '@/utils/createMetadata'
import WaitingListClient from './WaitingListClient'

export const metadata: Metadata = createMetadata({
  title: "Join the Waiting List - School for Hackers",
  description: "Sign up for our waiting list and be the first to know when our AI development courses launch. Learn to build cutting-edge AI applications through project-based learning.",
});

export default function Page() {
  return <WaitingListClient />
}