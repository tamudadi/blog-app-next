'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CategoryForm } from '../_components/CategoryForm';

export default function Page() {
  const [name, setName] = useState('');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // カテゴリーをPOSTで作成。
      const res = await fetch(`/api/admin/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      // 作成したカテゴリーのIDを取得。
      const { id } = await res.json();

      // 作成したカテゴリーのページへ遷移。
      router.push(`/admin/categories/${id}`);

      alert('カテゴリーを作成しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-8">カテゴリー作成</h1>
      <CategoryForm
        mode="new"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
