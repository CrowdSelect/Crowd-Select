'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function EditContentPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    fetch(`/api/content/${params.id}`)
      .then(response => response.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(error => console.error('Error fetching content:', error));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('You must be logged in to edit content');
      return;
    }

    try {
      const response = await fetch(`/api/content/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update content');
      }

      alert('Content updated successfully!');
      router.push('/profile');
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Failed to update content. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Edit Content</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-2">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-40 text-black"
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Update Content
        </button>
      </form>
    </div>
  );
}