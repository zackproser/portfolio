'use client';

import Image from "next/image";
import Link from "next/link";
const githubSignin = 'https://zackproser.b-cdn.net/images/github-signin.webp';

export default function Component() {
          const handleClick = async (e) => {
                    e.preventDefault();
                    // This triggers server-side Auth.js email provider; avoids bundling nodemailer client-side
                    if (typeof window !== 'undefined') {
                              fetch('/api/auth/signin?provider=email', { method: 'POST' }).catch(()=>{})
                    }
          };

          return (
                    <Link onClick={handleClick} href="/learn" passHref>
                              <Image width={1200} src={githubSignin} alt="Github Signin"  height={600}/>
                    </Link>
          );
}
