'use client';

import { Category } from '@/app/_types/Category';
import Link from 'next/link';
import { useFetch } from '../_hooks/useFetch';

export default function Page() {
  const { data, error, isLoading } = useFetch<{ categories: Category[] }>(
    '/api/admin/categories'
  );
  const categories = data?.categories ?? [];
  if (error) return <div>データ取得に失敗しました</div>;
  if (isLoading) return <div>読み込み中...</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">カテゴリー一覧</h1>
        <Link
          href="/admin/categories/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          新規カテゴリー作成
        </Link>
      </div>

      <div>
        {categories.map((category) => {
          return (
            <Link href={`/admin/categories/${category.id}`} key={category.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl font-bold">{category.name}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
