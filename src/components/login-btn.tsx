import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  console.dir(session)
  if (session) {
    return (
      <>
        <button
          className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-12 rounded border-slate-300"
          onClick={() => signOut()}
        >Sign out</button>
      </>
    )
  }

  return (
    <>
      <div className="relative">

        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="p-3">
            <button
              className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-12 rounded border-slate-300"
              onClick={() => signIn()}
            >
              Login to Zachary Proser&apos;s School for Hackers!
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
