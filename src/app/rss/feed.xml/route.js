import { Feed } from 'feed'
import { getAllContent } from '@/lib/content-handlers'

export async function GET() {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!siteUrl) {
    throw Error('Missing NEXT_PUBLIC_SITE_URL environment variable')
  }

  let author = {
    name: 'Zachary Proser',
    email: 'zackproser@gmail.com',
  }

  let feed = new Feed({
    title: author.name,
    description: 'AI engineer',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
      json: `${siteUrl}/feed.json`,
    },
  })

  // Use our new content system to get all content types
  let articles = await getAllContent('blog')
  let videos = await getAllContent('videos')
  let courses = await getAllContent('learn/courses')

  for (let article of articles) {
    let publicUrl = `${siteUrl}/blog/${article.slug}`
    const title = article.title
    const date = article.date

    console.log(publicUrl, title, date)

    feed.addItem({
      title,
      id: publicUrl,
      link: publicUrl,
      author: [author],
      contributor: [author],
      date: new Date(date),
    })
  }

  for (let video of videos) {
    let publicUrl = `${siteUrl}/videos/${video.slug}`
    const title = video.title
    const date = video.date

    feed.addItem({
      title,
      id: publicUrl,
      link: publicUrl,
      author: [author],
      contributor: [author],
      date: new Date(date),
    })
  }

  for (let course of courses) {
    let publicUrl = `${siteUrl}/learn/courses/${course.slug}`
    const title = course.title
    const date = course.date

    feed.addItem({
      title,
      id: publicUrl,
      link: publicUrl,
      author: [author],
      contributor: [author],
      date: new Date(date),
    })
  }

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'content-type': 'application/xml',
      'cache-control': 's-maxage=31556952',
    },
  })
}