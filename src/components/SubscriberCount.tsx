// Single source of truth for newsletter subscriber count.
// Update this value when you cross a new milestone.
const SUBSCRIBER_COUNT = "4,000+"

export default function SubscriberCount() {
  return SUBSCRIBER_COUNT
}

export function getSubscriberCount(): string {
  return SUBSCRIBER_COUNT
}
