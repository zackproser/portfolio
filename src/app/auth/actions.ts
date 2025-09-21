"use server"

import { signIn } from "../../../auth"

export async function emailSignIn(formData: FormData) {
  const email = String(formData.get("email") || "")
  const callbackUrl = String(formData.get("callbackUrl") || "/")
  if (!email) {
    return
  }
  await signIn("email", { email, redirect: true, callbackUrl })
}

export async function resendMagicEmail(email: string) {
  if (!email) return
  await signIn("email", { email, redirect: false })
}

