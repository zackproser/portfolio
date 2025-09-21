// Minimal ambient module shims to satisfy type resolution in isolated tooling
// These are safely overridden by real types in a full Next.js build environment.

declare module 'next/image' {
  const Image: any
  export default Image
}

declare module 'next/navigation' {
  export const usePathname: any
}

declare module '@vercel/analytics' {
  export const track: (...args: any[]) => void
}

declare module 'next-auth/react' {
  export const useSession: any
}

// Fallback for JSX intrinsic elements to prevent implicit any errors in isolated analysis
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

