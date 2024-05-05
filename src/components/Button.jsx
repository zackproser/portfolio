import Link from 'next/link';

export function Button({
  href = '',
  variant = 'green',
  ...props

}) {
  return (
    <Link href={href} className={'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none bg-green-400 text-xl font-extrabold text-white hover:bg-green-400 active:bg-green-400 active:text-zinc-900/60 dark:bg-green-400/50 dark:text-zinc-300 dark:hover:bg-green-400 dark:hover:text-zinc-50 dark:active:bg-green-400/50 dark:active:text-zinc-50/70'}>{props.children}</Link>
)}

