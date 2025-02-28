import { Metadata } from 'next'

interface PageProps {
  params: {
    param: string;
  };
}

export const metadata: Metadata = {
  title: 'Test Dynamic Route',
  description: 'A test page to verify dynamic routing'
}

export default function TestDynamicRoutePage({ params }: PageProps) {
  const { param } = params
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dynamic Route Test</h1>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-8">
        <h2 className="text-2xl font-semibold mb-4">Route Parameters</h2>
        <p className="mb-2">
          <strong>param:</strong> {param}
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How Dynamic Routing Works</h2>
        <p>
          This page demonstrates that dynamic routing is working correctly.
          The value in the URL after /test-dynamic-route/ is captured as the "param" parameter
          and displayed above.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Try Other Values</h2>
        <ul className="list-disc pl-6">
          <li className="mb-2">
            <a href="/test-dynamic-route/hello" className="text-blue-500 hover:underline">
              /test-dynamic-route/hello
            </a>
          </li>
          <li className="mb-2">
            <a href="/test-dynamic-route/world" className="text-blue-500 hover:underline">
              /test-dynamic-route/world
            </a>
          </li>
          <li className="mb-2">
            <a href="/test-dynamic-route/123" className="text-blue-500 hover:underline">
              /test-dynamic-route/123
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
} 