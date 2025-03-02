import clsx from 'clsx'

export function SectionHeading({
  number,
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h2'> & { number: string }) {
  return (
    <h2
      className={clsx(className, 'inline-flex items-center gap-x-3 text-2xl font-medium tracking-tight text-slate-900 dark:text-white')}
      {...props}
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-base font-medium tracking-tight dark:bg-slate-800 dark:text-white"
      >
        {number}
      </span>
      {children}
    </h2>
  )
} 