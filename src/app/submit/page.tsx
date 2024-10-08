'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SubmitContent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [initialQuestions, setInitialQuestions] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Upload files and get their URLs
    const uploadedUrls = await Promise.all(files.map(async (file) => {
      const response = await fetch(`/api/upload-url?fileName=${encodeURIComponent(file.name)}`);
      const { uploadURL } = await response.json();
      
      await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      });

      return uploadURL.split('?')[0]; // Return the base URL without query parameters
    }));

    // Submit content with file URLs
    const contentResponse = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, initialQuestions, fileUrls: uploadedUrls }),
    });

    if (contentResponse.ok) {
      router.push('/');
    } else {
      console.error('Failed to submit content');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto mt-8">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        className="w-full p-2 border rounded h-32"
      />
      <textarea
        value={initialQuestions}
        onChange={(e) => setInitialQuestions(e.target.value)}
        placeholder="Initial Questions (one per line)"
        required
        className="w-full p-2 border rounded h-32"
      />
      <input
        type="file"
        onChange={handleFileChange}
        multiple
        accept="image/*,video/*"
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Submit Content
      </button>
    </form>
  );
}