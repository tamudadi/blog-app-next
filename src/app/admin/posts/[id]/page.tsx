'use client';

import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { Post } from '@/app/_types/Post';
import { PostInputs } from '@/app/_types/PostInputs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PostForm } from '../_components/PostForm';

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();
  const [initialValues, setInitialValues] = useState<PostInputs | null>(null);

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
      setInitialValues({
        title: post.title,
        content: post.content,
        thumbnailImageKey: post.thumbnailImageKey,
        categories: post.postCategories.map((pc) => pc.category),
      });
    };

    fetcher();
  }, [id, token]);

  //更新処理
  const onSubmit = async (data: PostInputs) => {
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('記事の更新に失敗しました');
      }

      alert('記事を更新しました');
    } catch (error) {
      console.error(error);
      alert('記事の更新に失敗しました');
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('記事を削除しますか')) return;
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (!res.ok) {
        throw new Error('記事の削除に失敗しました');
      }

      alert('記事を削除しました。');

      router.push('/admin/posts');
    } catch (error) {
      console.error(error);
      alert('記事の削除に失敗しました');
    }
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>

      <PostForm
        mode="edit"
        onSubmit={onSubmit}
        onDelete={handleDeletePost}
        defaultValues={initialValues ?? undefined}
      />
    </>
  );
}
