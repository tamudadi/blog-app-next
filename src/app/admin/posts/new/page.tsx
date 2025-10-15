'use client';

import { Category } from '@/app/_types/Category';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PostForm } from '../_components/PostForm';

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://placehold.jp/800x400.png'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    //　フォームのデフォルトの動作をキャンセルする
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // APIエンドポイントにPOSTリクエストを送信する(記事作成)
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, categories, thumbnailUrl }),
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
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
