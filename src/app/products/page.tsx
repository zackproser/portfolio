import { getAllProducts } from '@/lib/content-handlers'
import ProductsPageClient from './products-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digital Products | Zachary Proser',
  description: 'High-quality digital products for developers, covering advanced techniques in software development, AI, and productivity.',
}

export default async function ProductsPage() {
  const products = await getAllProducts()
  
  return (
    <ProductsPageClient products={products} />
  )
}