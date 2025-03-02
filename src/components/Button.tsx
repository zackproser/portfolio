import Link from 'next/link'
import clsx from 'clsx'
import { track } from '@vercel/analytics'

const baseStyles = {
  solid:
    'inline-flex justify-center rounded-md py-1 px-4 text-base font-semibold tracking-tight shadow-sm focus:outline-hidden',
  outline:
    'inline-flex justify-center rounded-md border py-[calc(--spacing(1)-1px)] px-[calc(--spacing(4)-1px)] text-base font-semibold tracking-tight focus:outline-hidden',
}

const variantStyles = {
  solid: {
    slate:
      'bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:bg-slate-700 active:text-white/80 disabled:opacity-30 disabled:hover:bg-slate-900',
    blue: 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-700 active:text-white/80 disabled:opacity-30 disabled:hover:bg-blue-600',
    white:
      'bg-white text-blue-600 hover:text-blue-700 focus-visible:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:bg-blue-50 active:text-blue-900/80 disabled:opacity-40 disabled:hover:text-blue-600',
    green: 'bg-green-600 text-white hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 active:bg-green-700 active:text-white/80 disabled:opacity-30 disabled:hover:bg-green-600',
  },
  outline: {
    slate:
      'border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 active:border-slate-200 active:bg-slate-50 active:text-slate-900/70 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent',
    blue: 'border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:text-blue-600/70 disabled:opacity-40 disabled:hover:border-blue-300 disabled:hover:bg-transparent',
    green: 'border-green-300 text-green-600 hover:border-green-400 hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 active:text-green-600/70 disabled:opacity-40 disabled:hover:border-green-300 disabled:hover:bg-transparent',
  },
}

type ButtonProps = (
  | {
      variant?: 'solid'
      color?: keyof typeof variantStyles.solid
    }
  | {
      variant: 'outline'
      color?: keyof typeof variantStyles.outline
    }
) &
  (
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'color'>
    | (Omit<React.ComponentPropsWithoutRef<'button'>, 'color'> & {
        href?: undefined
      })
  )

export function Button({ className, ...props }: ButtonProps) {
  props.variant ??= 'solid'
  props.color ??= 'slate'

  className = clsx(
    baseStyles[props.variant],
    props.variant === 'outline'
      ? variantStyles.outline[props.color as keyof typeof variantStyles.outline]
      : props.variant === 'solid'
        ? variantStyles.solid[props.color as keyof typeof variantStyles.solid]
        : undefined,
    className,
  )

  const handleClick = (e: React.MouseEvent) => {
    // Track the button click with analytics
    track('button_click', {
      href: props.href ? String(props.href) : '',
      text: typeof props.children === 'string' ? props.children : 'Button',
      variant: props.variant ? String(props.variant) : 'solid',
      color: props.color ? String(props.color) : 'slate',
      location: typeof window !== 'undefined' ? window.location.pathname : '',
      'aria-label': props['aria-label'] ? String(props['aria-label']) : '',
    })

    // Call the original onClick handler if it exists
    if (props.onClick) {
      // Use type assertion to handle the event type mismatch
      props.onClick(e as any)
    }
  }

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} onClick={handleClick} />
  ) : (
    <Link className={className} {...props} onClick={handleClick} />
  )
}

