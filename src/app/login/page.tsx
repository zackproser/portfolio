import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "../../../auth";
import { AuthError } from "next-auth";
import Link from "next/link";

export default async function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">Welcome back!</h1>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Sign in to your account to continue using zackproser.com.
          </p>
          <div className="space-y-4">
            {Object.values(providerMap).map((provider) => (
              <form
                key={provider.id}
                action={async () => {
                  "use server"
                  try {
                    await signIn(provider.id);
                  } catch (error) {
                    if (error instanceof AuthError) {
                      return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                    }
                    throw error;
                  }
                }}
              >
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                >
                  <ProviderIcon provider={provider.name} className="mr-2 h-4 w-4" />
                  Sign in with {provider.name}
                </button>
              </form>
            ))}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link href="#" className="text-sm font-medium text-primary hover:underline dark:text-primary-light">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              Sign in
            </button>
          </div>
        </div>
        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="#" className="font-medium text-primary hover:underline dark:text-primary-light">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProviderIcon({ provider, ...props }) {
  switch (provider) {
    case 'GitHub':
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
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    // Add other providers' icons here
    default:
      return null;
  }
}

