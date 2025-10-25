'use client';

import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { PostInputs } from '@/app/_types/PostInputs';
import { useRouter } from 'next/navigation';
import { PostForm } from '../_components/PostForm';

export default function Page() {
  const router = useRouter();
  const { token } = useSupabaseSession();

  // RHF（PostForm）から送られるdataを受け取る
  const onSubmit = async (data: PostInputs) => {
    if (!token) return;

    try {
      // APIエンドポイントにPOSTリクエストを送信する(記事作成)
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(data),
      });

      // レスポンスから新しく作成された記事のIDを取得する
      const { id } = await res.json();

      // 記事詳細ページにリダイレクトする
      router.push(`/admin/posts/${id}`);

      alert('記事を作成しました');
    } catch (error) {
      console.error(error);
      alert('記事の作成に失敗しました');
    }
  };
  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-4">記事作成</h1>
      </div>

      <PostForm mode="new" onSubmit={onSubmit} />
    </div>
  );
}
