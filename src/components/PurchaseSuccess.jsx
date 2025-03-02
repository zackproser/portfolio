import { Button } from "@/components/Button"

export default function PurchaseSuccess({
  productName,
  customerEmail,
  courseUrl
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 justify-center">THANK YOU</h1>
      </header>
      <section className="flex flex-col items-center justify-center space-y-4">
        <CheckCircleIcon className="h-16 w-16 text-green-500" />
        <p className="text-lg text-gray-700 dark:text-gray-300">Your purchase was successful!</p>
      </section>
      <section className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Details</h2>
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Course:</span>
          <span className="font-medium">{productName}</span>
        </div>
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Delivery Address:</span>
          <span className="font-medium">{customerEmail}</span>
        </div>
      </section>
      <div className="flex gap-4 mt-10">
        <Button 
          variant="solid" 
          color="green" 
          href={courseUrl}
        >
          Start your course
        </Button>
        <Button 
          variant="secondary" 
          href={"/learn"}
        >
          Return to all courses
        </Button>
      </div>
    </div>
  )
}

function CheckCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
