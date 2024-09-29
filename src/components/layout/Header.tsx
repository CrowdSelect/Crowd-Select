'use client'

import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-blue-500 text-white py-2">
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <ul className="flex space-x-6">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li><Link href="/submit" className="hover:underline">Submit Content</Link></li>
          <li><Link href="/vote" className="hover:underline">Vote</Link></li>
          <li><Link href="/results" className="hover:underline">Results</Link></li>
          {session && <li><Link href="/profile" className="hover:underline">Profile</Link></li>}
        </ul>
        {session ? (
          <button onClick={() => signOut()} className="hover:underline">Logout</button>
        ) : (
          <Link href="/login" className="hover:underline">Login</Link>
        )}
      </nav>
    </header>
  );
}