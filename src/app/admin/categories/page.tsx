'use client';

import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { Category } from '@/app/_types/Category';
import Link from 'next/link';
import useSWR from 'swr';
export default function Page() {
  const { token } = useSupabaseSession();

  //SWRを使ったデータ取得(内部でuseEffectを使っているため、ここではuseEffectは不要)
  //fetcherでリターンした項目をuseStateなしで管理できる。
  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!,
      },
    });
    const { categories } = await res.json();
    return categories as Category[];
  };

  // SWRでデータ取得
  const {
    data: categories,
    error,
    isLoading,
  } = useSWR(token ? '/api/admin/categories' : null, fetcher);

  if (error) return <div>データ取得に失敗しました</div>;
  if (isLoading || !categories) return <div>読み込み中...</div>;

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
