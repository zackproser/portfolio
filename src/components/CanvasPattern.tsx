import { useId } from 'react'

export function CanvasPattern({
  width = 200,
  height = 200,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  width?: number
  height?: number
}) {
  const patternId = useId()
  const maskId = useId()

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternTransform="translate(0 0) scale(0.6) rotate(0)"
        >
          <rect width="100%" height="100%" fill="currentColor" fillOpacity="0.1" />
          <path
            d="M0 0h1v1H0zM3 3h1v1H3zM6 6h1v1H6zM9 9h1v1H9z"
            fill="currentColor"
            fillOpacity="0.05"
          />
          <path
            d="M1 1h1v1H1zM4 4h1v1H4zM7 7h1v1H7z"
            fill="currentColor"
            fillOpacity="0.05"
          />
          <path
            d="M2 2h1v1H2zM5 5h1v1H5zM8 8h1v1H8z"
            fill="currentColor"
            fillOpacity="0.05"
          />
        </pattern>
        <mask id={maskId}>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        mask={`url(#${maskId})`}
      />
    </svg>
  )
} 