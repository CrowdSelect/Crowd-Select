import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-40px)] text-center px-4">
      <h1 className="text-5xl font-bold mb-4 text-white">Welcome to Crowd Select</h1>
      <p className="text-xl mb-8 text-gray-300">Get valuable feedback on your content from a diverse audience.</p>
      <div className="space-y-4 w-full max-w-md">
        <Link href="/submit" className="block w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold">
          Submit Content
        </Link>
        <Link href="/vote" className="block w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold">
          Start Voting
        </Link>
      </div>
    </div>
  );
}