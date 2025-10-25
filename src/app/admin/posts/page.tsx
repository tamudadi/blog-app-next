'use client';

import { Post } from '@/app/_types/Post';
import Link from 'next/link';
import { useFetch } from '../_hooks/useFetch';
Link;

export default function Page() {
  const { data, error, isLoading } = useFetch<{ posts: Post[] }>(
    '/api/admin/posts'
  );
  const posts = data?.posts;

  if (error) return <div>データ取得に失敗しました</div>;
  if (isLoading || !posts) return <div>読み込み中...</div>;

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <Link
          href="/admin/posts/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          新規作成
        </Link>
      </div>

      <div className="">
        {posts.map((post) => {
          return (
            <Link href={`/admin/posts/${post.id}`} key={post.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl font-bold">{post.title}</div>
                <div className="text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
