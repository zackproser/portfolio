import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { GridPattern } from '@/components/GridPattern'
import { track } from '@vercel/analytics'

function Plan({
  name,
  description,
  price,
  features,
  href,
  featured = false,
}: {
  name: string
  description: string
  price: string
  features: string[]
  href: string
  featured?: boolean
}) {
  return (
    <div
      className={clsx(
        'relative px-4 py-16 sm:rounded-5xl sm:px-10 md:py-12 lg:px-12',
        featured && 'bg-blue-600 sm:shadow-lg',
      )}
    >
      {featured && (
        <div className="absolute inset-0 text-white/10 [mask-image:linear-gradient(white,transparent)]">
          <GridPattern x="50%" y="50%" />
        </div>
      )}
      <div className="relative flex flex-col">
        <h3
          className={clsx(
            'mt-7 text-lg font-semibold tracking-tight',
            featured ? 'text-white' : 'text-slate-900',
          )}
        >
          {name}
        </h3>
        <p
          className={clsx(
            'mt-2 text-lg tracking-tight',
            featured ? 'text-white' : 'text-slate-600',
          )}
        >
          {description}
        </p>
        <p className="order-first flex font-display font-bold">
          <span
            className={clsx(
              'text-[1.75rem] leading-tight',
              featured ? 'text-blue-200' : 'text-slate-500',
            )}
          >
            $
          </span>
          <span
            className={clsx(
              'ml-1 mt-1 text-7xl tracking-tight',
              featured ? 'text-white' : 'text-slate-900',
            )}
          >
            {price}
          </span>
        </p>
        <div className="order-last mt-8">
          <ul
            role="list"
            className={clsx(
              '-my-2 divide-y text-base tracking-tight',
              featured
                ? 'divide-white/10 text-white'
                : 'divide-slate-200 text-slate-900',
            )}
          >
            {features.map((feature) => (
              <li key={feature} className="flex py-2">
                <svg
                  aria-hidden="true"
                  className={clsx(
                    'h-8 w-8 flex-none',
                    featured ? 'fill-white' : 'fill-slate-600',
                  )}
                >
                  <path d="M11.83 15.795a1 1 0 0 0-1.66 1.114l1.66-1.114Zm9.861-4.072a1 1 0 1 0-1.382-1.446l1.382 1.446ZM14.115 21l-.83.557a1 1 0 0 0 1.784-.258L14.115 21Zm.954.3c1.29-4.11 3.539-6.63 6.622-9.577l-1.382-1.446c-3.152 3.013-5.704 5.82-7.148 10.424l1.908.598Zm-4.9-4.391 3.115 4.648 1.661-1.114-3.114-4.648-1.662 1.114Z" />
                </svg>
                <span className="ml-4">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button
          href={href}
          color={featured ? 'white' : 'slate'}
          className="mt-8"
          aria-label={`Get started with the ${name} plan for $${price}`}
        >
          Get started
        </Button>
      </div>
    </div>
  )
}

interface PricingProps {
  price: number
  title: string
  description?: string
  checkoutUrl: string
  productSlug?: string
  productType?: string
}

export function Pricing({ 
  price, 
  title, 
  description = "Get instant access to the complete guide and start building today.",
  checkoutUrl,
  productSlug = '',
  productType = ''
}: PricingProps) {
  
  const handleCheckoutClick = () => {
    track('checkout_button_click', {
      product_slug: productSlug,
      product_type: productType,
      product_title: title,
      product_price: price,
      location: typeof window !== 'undefined' ? window.location.pathname : ''
    });
  };
  
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="border-t border-slate-200 bg-slate-100 py-20 sm:py-32 dark:bg-slate-900 dark:border-slate-800"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="pricing-title"
            className="text-3xl font-medium tracking-tight text-slate-900 dark:text-white"
          >
            {title}
          </h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 items-start gap-x-8 gap-y-10 sm:mt-20 lg:grid-cols-2">
          <div className="mx-auto -mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-white py-10 text-center ring-1 ring-inset ring-slate-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16 dark:bg-white">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-slate-600 dark:text-slate-600">One-time purchase</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-900">${price}</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-slate-600 dark:text-slate-600">USD</span>
                </p>
                <Button
                  href={checkoutUrl}
                  color="blue"
                  className="mt-10 block w-full"
                  onClick={handleCheckoutClick}
                >
                  Get instant access
                </Button>
                <p className="mt-6 text-xs leading-5 text-slate-600 dark:text-slate-600">
                  Secure payment processing with Stripe. Instant delivery via email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
} 