'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function ContentPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [content, setContent] = useState(null);
  const [vote, setVote] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchContent();
    }
  }, [params.id]);

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch content');
      const data = await res.json();
      setContent(data);
      if (session && data.votes) {
        const userVote = data.votes.find(v => v.userId === session.user.id);
        if (userVote) setVote(userVote.value);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleVote = async (value) => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId: params.id, vote: value }),
      });

      if (res.ok) {
        setVote(value);
        fetchContent();
      } else {
        throw new Error('Failed to submit vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
      <p className="mb-4">{content.description}</p>
      
      <div className="mb-4 flex flex-wrap">
        {content.fileUrls.map((url, index) => (
          <div key={index} className="m-2 cursor-pointer" onClick={() => handleFileSelect(url)}>
            {url.toLowerCase().endsWith('.mp4') ? (
              <video src={url} width="150" height="150" />
            ) : (
              <Image src={url} alt={`Content ${index + 1}`} width={150} height={150} objectFit="cover" />
            )}
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="mb-4">
          {selectedFile.toLowerCase().endsWith('.mp4') ? (
            <video src={selectedFile} controls width="100%" height="auto" />
          ) : (
            <Image src={selectedFile} alt="Selected content" layout="responsive" width={16} height={9} objectFit="contain" />
          )}
        </div>
      )}

      <div className="mb-4">
        <button 
          onClick={() => handleVote('up')} 
          className={`mr-2 p-2 ${vote === 'up' ? 'bg-green-500' : 'bg-gray-200'}`}
        >
          Upvote ({content.upvotes})
        </button>
        <button 
          onClick={() => handleVote('down')} 
          className={`p-2 ${vote === 'down' ? 'bg-red-500' : 'bg-gray-200'}`}
        >
          Downvote ({content.downvotes})
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">Questions:</h2>
      <ul className="list-disc pl-5">
        {content.generatedQuestions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
    </div>
  );
}