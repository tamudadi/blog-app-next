'use client';

import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CategoryForm } from '../_components/CategoryForm';

export default function Page() {
  const [name, setName] = useState('');
  const { id } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      const { category } = await res.json();
      setName(category.name);
    };

    fetcher();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // カテゴリーをPUTで更新。
      if (!token) return;
      await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ name }),
      });

      alert('カテゴリーを更新しました');

      // カテゴリー一覧へ遷移。
      router.push('/admin/categories');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm(`カテゴリー:${name}を削除しますか？`)) return;
    setIsSubmitting(true);

    try {
      if (!token) return;
      // カテゴリーをDELETEで削除。
      await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',

        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      alert(`カテゴリー:${name}を削除しました`);

      // カテゴリー一覧へ遷移。
      router.push('/admin/categories');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
      </div>

      <CategoryForm
        mode="edit"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
