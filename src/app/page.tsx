//INFO:useEffect や useState などの クライアントサイドの機能 を使う場合は、ファイルの先頭に'use client'の記述が必要。
'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { Post } from './_types/Post';

export default function Home() {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    const { posts } = await res.json();
    return posts as Post[];
  };
  const { data: posts = [], error, isLoading } = useSWR('/api/posts', fetcher);

  if (error) return <div>データ取得に失敗しました</div>;

  if (isLoading) return <div>読み込み中...</div>;

  return (
    <>
      <div className="my-10 mx-6">
        <ul className="flex flex-col gap-10">
          {posts.map((post) => {
            return (
              <li key={post.id} className="border p-4">
                <Link href={`/posts/${post.id}`}>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      {post.postCategories.map((pc) => {
                        return (
                          <div
                            key={pc.category.id}
                            className="border border-blue-500 rounded text-blue-500 text-sm px-2 py-1"
                          >
                            {pc.category.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <h1 className="text-2xl mt-2 mb-4">{post.title}</h1>
                  <p
                    className="line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
