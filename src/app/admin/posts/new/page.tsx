'use client';

import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { Category } from '@/app/_types/Category';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PostForm } from '../_components/PostForm';

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnailImageKey, setThumbnailImageKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSupabaseSession();

  const handleSubmit = async (e: React.FormEvent) => {
    //　フォームのデフォルトの動作をキャンセルする
    e.preventDefault();
    setIsSubmitting(true);
    if (!token) return;

    try {
      // APIエンドポイントにPOSTリクエストを送信する(記事作成)
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ title, content, categories, thumbnailImageKey }),
      });

      // レスポンスから新しく作成された記事のIDを取得する
      const { id } = await res.json();

      // 記事詳細ページにリダイレクトする
      router.push(`/admin/posts/${id}`);

      alert('記事を作成しました');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-4">記事作成</h1>
      </div>

      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        categories={categories}
        setCategories={setCategories}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
