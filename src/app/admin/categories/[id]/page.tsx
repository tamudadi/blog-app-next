'use client';

import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { Category } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFetch } from '../../_hooks/useFetch';
import { CategoryForm } from '../_components/CategoryForm';

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSupabaseSession();

  const { data, error, isLoading, mutate } = useFetch<{ category: Category }>(
    `/api/admin/categories/${id}`
  );
  const category = data?.category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !token) return;
    setIsSubmitting(true);

    try {
      // カテゴリーをPUTで更新。
      await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ name: category.name }),
      });

      alert('カテゴリーを更新しました');

      // カテゴリー一覧へ遷移。
      router.push('/admin/categories');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!category || !token) return;
    if (!confirm(`カテゴリー:${category.name}を削除しますか？`)) return;
    setIsSubmitting(true);

    try {
      // カテゴリーをDELETEで削除。
      await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      alert(`カテゴリー:${category.name}を削除しました`);
      // カテゴリー一覧へ遷移。
      router.push('/admin/categories');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <div>エラーが発生しました</div>;
  if (isLoading || !category) return <div>読み込み中...</div>;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
      </div>

      <CategoryForm
        mode="edit"
        name={category.name}
        setName={(v: string) =>
          mutate({ category: { ...category!, name: v } }, false)
        }
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
