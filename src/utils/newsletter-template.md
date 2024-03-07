import Image from 'next/image'
import Link from 'next/link'

import { ArticleLayout } from '@/components/ArticleLayout'

import beaker from '@/images/beaker.webp'

import { createMetadata } from '@/utils/createMetadata'

export const metadata = createMetadata({
    author: "Zachary Proser", 
    date: "{{date}}",
    title: "{{title}}", 
    description: "{{description}}",
    image: beaker
})

export default (props) => <ArticleLayout metadata={metadata} {...props} />

## Table of contents

## My work

## What's abuzz in the news

{{headlines}}

## My favorite tools
