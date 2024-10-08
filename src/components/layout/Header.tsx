'use client';

import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from 'react';

export default function Header() {
  const { data: session } = useSession()
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const { solana } = window as any;
      if (solana?.isPhantom) {
        const response = await solana.connect();
        setWalletAddress(response.publicKey.toString());
      } else {
        alert('Phantom wallet not found! Please install it from https://phantom.app/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const { solana } = window as any;
    if (solana?.isPhantom) {
      solana.on('connect', () => {
        setWalletAddress(solana.publicKey.toString());
      });
      solana.on('disconnect', () => {
        setWalletAddress(null);
      });
    }
  }, []);

  return (
    <header className="bg-blue-500 text-white py-2">
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">CrowdSelect</Link>
        <ul className="flex space-x-6 items-center">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li><Link href="/submit" className="hover:underline">Submit Content</Link></li>
          <li><Link href="/vote" className="hover:underline">Vote</Link></li>
          <li><Link href="/results" className="hover:underline">Results</Link></li>
          {session ? (
            <>
              <li><Link href="/profile" className="hover:underline">Profile</Link></li>
              <li><button onClick={() => signOut()} className="hover:underline">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link href="/login" className="hover:underline">Login</Link></li>
              <li><Link href="/register" className="hover:underline">Register</Link></li>
            </>
          )}
          {walletAddress ? (
            <li className="bg-yellow-500 text-black px-2 py-1 rounded text-sm">
              {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
            </li>
          ) : (
            <li>
              <button onClick={connectWallet} className="bg-yellow-500 text-black px-2 py-1 rounded text-sm">
                Connect Wallet
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}