import ReactDOMServer from 'react-dom/server'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider'
import { Feed } from 'feed'
import { mkdir, writeFile } from 'fs/promises'

import { getAllArticles } from './getAllArticles'
import { getAllVideos } from './getAllVideos'

export async function generateRssFeed() {
  let articles = await getAllArticles()
  let videos = await getAllVideos()
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  let author = {
    name: 'Zachary Proser',
    email: 'zackproser@gmail.com',
  }

  let feed = new Feed({
    title: author.name,
    description: 'Zachary Proser&apos; portfolio',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/rss/feed.xml`,
      json: `${siteUrl}/rss/feed.json`,
    },
  })

  for (let article of articles) {
    let url = `${siteUrl}/blog/${article.slug}`
    let html = ReactDOMServer.renderToStaticMarkup(
      <MemoryRouterProvider>
        <article.component isRssFeed />
      </MemoryRouterProvider>
    )

    feed.addItem({
      title: article.title,
      id: url,
      link: url,
      description: article.description,
      content: html,
      author: [author],
      contributor: [author],
      date: new Date(article.date),
    })
  }

  for (let video of videos) {
    let url = `${siteUrl}/videos/${video.slug}`
    let html = ReactDOMServer.renderToStaticMarkup(
      <MemoryRouterProvider>
        <video.component isRssFeed />
      </MemoryRouterProvider>
    )

    feed.addItem({
      title: video.title,
      id: url,
      link: url,
      description: video.description,
      content: html,
      author: [author],
      contributor: [author],
      date: new Date(video.date),
    })
  }

  await mkdir('./public/rss', { recursive: true })
  await Promise.all([
    writeFile('./public/rss/feed.xml', feed.rss2(), 'utf8'),
    writeFile('./public/rss/feed.json', feed.json1(), 'utf8'),
  ])
}
