import { useId } from 'react'

export function Pattern({
  size = 40,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & { size?: number }) {
  let patternId = useId()

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          x="50%"
          y="50%"
          patternTransform="translate(-25 25)"
        >
          <path
            d="M.5 200V.5H200"
            fill="none"
            strokeWidth="1"
            strokeDasharray="8 4"
            stroke="currentColor"
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth="0"
        fill={`url(#${patternId})`}
      />
    </svg>
  )
} 