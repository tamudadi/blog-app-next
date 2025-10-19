'use client';

import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { Category } from '@/app/_types/Category';
import { Post } from '@/app/_types/Post';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PostForm } from '../_components/PostForm';

export default function Page() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnail] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const { id } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      const { post }: { post: Post } = await res.json();
      setTitle(post.title);
      setContent(post.content);
      setThumbnail(post.thumbnailUrl);
      setCategories(post.postCategories.map((pc) => pc.category));
    };

    fetcher();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!token) return;
      await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ title, content, thumbnailUrl, categories }),
      });

      alert('記事を更新しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('記事を削除しますか')) return;
    setIsSubmitting(true);
    if (!token) return;

    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      alert('記事を更新しました。');

      router.push('/admin/posts');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>

      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnail}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
